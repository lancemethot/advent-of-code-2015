import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from 'advent-of-code-utils';

const day = 'day22';

enum Spells {
    MISSLE   =  53,
    DRAIN    =  73,
    SHIELD   = 113,
    POISON   = 173,
    RECHARGE = 229
}

type Stats = {
    damage: number;
    armor: number;
}

type Combatant = Stats & {
    hitpoints: number;
}

type Boss = Combatant & {
    poison: number;
}

type Player = Combatant & {
    mana: number;
    shield: number;
    recharge: number;
}

type Battle = HeapItem & {
    player: Player;
    boss: Boss;
    effects: number[];
    playerTurn: boolean;
}

function parseInput(input: string[]): Boss {
    return input.reduce((acc, line) => {
        const [stat, val] = line.split(": ");
        switch(stat) {
            case 'Hit Points': acc.hitpoints = Number.parseInt(val); break;
            case 'Damage': acc.damage = Number.parseInt(val); break;
        }
        return acc;
    }, { hitpoints: 0, damage: 0, armor: 0, poison: 0 });
}

const spells: number[]  = [
    Spells.MISSLE,
    Spells.DRAIN,
    Spells.SHIELD,
    Spells.POISON,
    Spells.RECHARGE
];

function battle(player: Player, boss: Boss, hardmode: boolean = false): number {
    let lowestManaWin: number = Infinity;
    let heap: MinHeap<Battle> = new MinHeap();
    heap.insert({ player: player, boss: boss, effects: [], playerTurn: true, size: 0 });

    while(heap.size() > 0) {
        let battle: Battle = heap.extractMin();

        // not better than a previous battle
        if(battle.size > lowestManaWin) continue;

        let p: Player = battle.player;
        let b: Boss = battle.boss;
        let e: number[] = battle.effects;
        let c: number = battle.size;

        // debug(`\n-- ${battle.playerTurn ? 'Player' : 'Boss'} turn --`, day);
        // debug(`- Player has ${p.hitpoints} hit points, ${p.armor} armor, ${p.mana} mana`, day);
        // debug(`- Boss has ${b.hitpoints} hit points`, day);

        if(hardmode && battle.playerTurn) {
            p.hitpoints--;
            if(p.hitpoints <=0) continue;
        }

        // Apply effects
        e.forEach(effect => {
            switch(effect) {
                case Spells.SHIELD: p.shield--;
                          // debug(`Shields timer is now ${p.shield}`, day);
                          if(p.shield === 0) {
                            p.armor -= 7;
                            // debug(`Shield wears off, decreasing armor by 7.`, day);
                          }
                    break;
                case Spells.POISON: b.hitpoints -= 3;
                          b.poison--;
                          // debug(`Poison deals 3 damage; its timer is now ${b.poison}`, day);
                    break;
                 case Spells.RECHARGE: p.mana += 101;
                           p.recharge--;
                           // debug(`Recharge provides 101 mana; its timer is now ${p.recharge}`, day);
            }
        });

        // Effects wear off
        e = e.filter(effect => (effect === Spells.SHIELD && p.shield > 0) ||
                               (effect === Spells.POISON && b.poison > 0) ||
                               (effect === Spells.RECHARGE && p.recharge > 0));

        // Death by poison
        if(b.hitpoints <= 0) {
            lowestManaWin = Math.min(c, lowestManaWin);
            continue;
        }

        if(battle.playerTurn) {
            // Player turn.. try all available spells
            spells.filter(spell => !e.includes(spell))
                  .filter(spell => p.mana >= spell)
                  .forEach(spell => {

                let np = { ... p };
                let nb = { ... b };
                let ne = [ ... e ];
                let nc = c + spell;
                np.mana -= spell;
                switch(spell) {
                    case Spells.MISSLE: 
                        nb.hitpoints -= 4;
                        // debug(`Player casts Magic Missile, dealing 4 damage.`, day);
                        break;
                    case Spells.DRAIN: 
                        np.hitpoints += 2;
                        nb.hitpoints -= 2;
                        // debug(`Player casts Drain, dealing 2 damage, and healing 2 hit points.`, day);
                        break;
                    case Spells.SHIELD:
                        np.shield += 6;
                        np.armor += 7;
                        ne.push(spell);
                        // debug(`Player casts Shield, increasing armor by 7.`, day);
                        break;
                    case Spells.POISON:
                        nb.poison += 6;
                        ne.push(spell);
                        // debug(`Player casts Poison.`, day);
                        break;
                    case Spells.RECHARGE:
                        np.recharge += 5;
                        ne.push(spell);
                        // debug(`Player casts Recharge.`, day);
                }
                if(nb.hitpoints <= 0) {
                    // debug(`This kills the boss, and the player wins.`, day);
                    lowestManaWin = Math.min(nc, lowestManaWin);
                } else {
                    heap.insert({ player: np, boss: nb, effects: ne, playerTurn: false, size: nc });
                }
            });
        } else {
            // Boss turn
            p.hitpoints -= Math.max(b.damage - p.armor, 1);
            // debug(`Boss attacks for ${Math.max(b.damage - p.armor, 1)} damage.`, day);
            if(p.hitpoints > 0) {
                heap.insert({ player: p, boss: b, effects: e, playerTurn: true, size: c });
            } else {
                // debug(`Player dead.`, day);
            }
        }
    }

    return lowestManaWin;

}

function partOne(input: string[], playerHitpoints: number, playerManaPoints: number): number {
    const boss: Boss = parseInput(input);
    const player: Player = { hitpoints: playerHitpoints, mana: playerManaPoints, damage: 0, armor: 0, shield: 0, recharge: 0 };
    return battle(player, boss);
}

function partTwo(input: string[], playerHitpoints: number, playerManaPoints: number): number {
    const boss: Boss = parseInput(input);
    const player: Player = { hitpoints: playerHitpoints, mana: playerManaPoints, damage: 0, armor: 0, shield: 0, recharge: 0 };
    return battle(player, boss, true);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day, 1), 10, 250)).toBe(226);
    expect(partOne(getExampleInput(day, 2), 10, 250)).toBe(641);
    expect(partOne(getDayInput(day), 50, 500)).toBe(1269);

    expect(partTwo(getExampleInput(day, 1), 10, 250)).toBe(Infinity);
    expect(partTwo(getExampleInput(day, 2), 10, 250)).toBe(Infinity);
    expect(partTwo(getDayInput(day), 50, 500)).toBe(1309);
});
