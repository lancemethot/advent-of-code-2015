import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day21';

type Stats = {
    damage: number;
    armor: number;
}

type Item = Stats & {
    cost: number;
}

type Combatant = Stats & {
    hitpoints: number;
}

const weapons: Item[] = [ { cost:  8, damage: 4, armor: 0 },
                          { cost: 10, damage: 5, armor: 0 },
                          { cost: 25, damage: 6, armor: 0 },
                          { cost: 40, damage: 7, armor: 0 },
                          { cost: 74, damage: 8, armor: 0 } ];

const armor: Item[] = [ { cost:  13, damage: 0, armor: 1 },
                        { cost:  31, damage: 0, armor: 2 },
                        { cost:  53, damage: 0, armor: 3 },
                        { cost:  75, damage: 0, armor: 4 },
                        { cost: 102, damage: 0, armor: 5 } ];

const rings: Item[] = [ { cost:  25, damage: 1, armor: 0 },
                        { cost:  50, damage: 2, armor: 0 },
                        { cost: 100, damage: 3, armor: 0 },
                        { cost:  20, damage: 0, armor: 1 },
                        { cost:  40, damage: 0, armor: 2 },
                        { cost:  80, damage: 0, armor: 3 } ];

function parseInput(input: string[]): Combatant {
    return input.reduce((acc, line) => {
        const [stat, val] = line.split(": ");
        switch(stat) {
            case 'Hit Points': acc.hitpoints = Number.parseInt(val); break;
            case 'Damage': acc.damage = Number.parseInt(val); break;
            case 'Armor': acc.armor = Number.parseInt(val); break;
        }
        return acc;
    }, { hitpoints: 0, damage: 0, armor: 0 });
}

function attack(damage: number, armor: number): number {
    return Math.max((damage - armor), 1);
}

function playerWins(player: Combatant, boss: Combatant): boolean {
    const p: Combatant = { ... player };
    const b: Combatant = { ... boss };
    while(p.hitpoints > 0) {
        b.hitpoints -= attack(p.damage, b.armor);
        if(b.hitpoints <= 0) return true;
        p.hitpoints -= attack(b.damage, p.armor);
    }
    return false;
}

function gearUp(): Item[][] {
    const gearList: Item[][] = [];
    weapons.forEach(weapon => {
        gearList.push([ weapon ]);
        armor.forEach(armor => {
            gearList.push([ weapon, armor ]);
        });
        rings.forEach((ring, index) => {
            gearList.push([ weapon, ring ]);
            for(let i = index + 1; i < rings.length; i++) {
                gearList.push([ weapon, ring, rings[i] ]);
            }

            armor.forEach(armor => {
                gearList.push([ weapon, armor, ring ]);
                for(let i = index + 1; i < rings.length; i++) {
                    gearList.push([ weapon, armor, ring, rings[i] ]);
                }
            })
        });
    });
    return gearList;
}

function suitUp(gear: Item[], playerHitpoints: number): Combatant {
    return {
        hitpoints: playerHitpoints,
        ... gear.reduce((acc, item) => {
            acc.damage += item.damage;
            acc.armor += item.armor;
            return acc;
        }, { damage: 0, armor: 0 } as Stats)
    };
}

function partOne(input: string[], playerHitpoints: number): number {
    const boss: Combatant = parseInput(input);
    const gear: Item[][] = gearUp();
    gear.sort((a, b) => a.reduce((acc, i) => acc += i.cost, 0) - b.reduce((acc, i) => acc += i.cost, 0));
    while(gear.length > 0) {
        const suit: Item[] = gear.shift()!;
        const player: Combatant = suitUp(suit, playerHitpoints);
        if(playerWins(player, boss)) return suit.reduce((acc, i) => acc += i.cost, 0);
    }
    return 0;
}

function partTwo(input: string[], playerHitpoints: number): number {
    const boss: Combatant = parseInput(input);
    const gear: Item[][] = gearUp();
    gear.sort((a, b) => b.reduce((acc, i) => acc += i.cost, 0) - a.reduce((acc, i) => acc += i.cost, 0));
    while(gear.length > 0) {
        const suit: Item[] = gear.shift()!;
        const player: Combatant = suitUp(suit, playerHitpoints);
        if(!playerWins(player, boss)) return suit.reduce((acc, i) => acc += i.cost, 0);
    }
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 8)).toBe(65);
    expect(partOne(getDayInput(day), 100)).toBe(121);

    expect(partTwo(getExampleInput(day), 8)).toBe(188);
    expect(partTwo(getDayInput(day), 100)).toBe(201);
});
