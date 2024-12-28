import { debug, getDayInput } from '../utils';

const day = 'day6';

type Coord = {
    x: number;
    y: number;
}

type Command = {
    cmd: string;
    from: Coord;
    to: Coord;
}

function parseCommand(input: string): Command | null {
    let matches: RegExpMatchArray | null = input.match(/(turn on|turn off|toggle|) (\d+,\d+) through (\d+,\d+)/);
    if(matches !== null) {
        let command: string = matches[1];
        let [a, b]: number[] = matches[2].split(',').map(c => Number.parseInt(c));
        let [c, d]: number[] = matches[3].split(',').map(c => Number.parseInt(c));
        return {
            cmd: command,
            from: { x: a, y: b },
            to: { x: c, y: d }
        }
    }
    return null;
}

function partOne(input: string[]): number {
    let grid: boolean[][] = Array.from({ length: 1000 }, e => Array.from({ length: 1000 }, e => false));
    input.forEach(line => {
        let parsed: Command | null = parseCommand(line);
        if(parsed !== null) {
            for(let x = parsed.from.x; x <= parsed.to.x; x++) {
                for(let y = parsed.from.y; y <= parsed.to.y; y++) {
                    switch(parsed.cmd) {
                        case 'turn on': grid[x][y] = true; break;
                        case 'turn off': grid[x][y] = false; break;
                        default: grid[x][y] = !grid[x][y];
                    }
                }
            }
        }
    });
    return grid.reduce((acc, row) => acc + row.filter(col => col).length, 0);
}

function partTwo(input: string[]): number {
    let grid: number[][] = Array.from({ length: 1000 }, e => Array.from({ length: 1000 }, e => 0));
    input.forEach(line => {
        let parsed: Command | null = parseCommand(line);
        if(parsed !== null) {
            for(let x = parsed.from.x; x <= parsed.to.x; x++) {
                for(let y = parsed.from.y; y <= parsed.to.y; y++) {
                    switch(parsed.cmd) {
                        case 'turn on': grid[x][y] += 1; break;
                        case 'turn off': grid[x][y] = (grid[x][y] === 0 ? 0 : grid[x][y] - 1); break;
                        default: grid[x][y] += 2;
                    }
                }
            }
        }
    });
    return grid.reduce((acc, row) => acc + row.reduce((rowacc, col) => rowacc + col, 0), 0);
}


test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(["turn on 0,0 through 999,999"])).toBe(1000 * 1000);
    expect(partOne(["toggle 0,0 through 999,0"])).toBe(1000);
    expect(partOne(["turn on 0,0 through 999,999", "toggle 0,0 through 999,0"])).toBe((1000 * 1000) - 1000);
    expect(partOne(["turn off 499,499 through 500,500"])).toBe(0);
    expect(partOne(["turn on 0,0 through 999,999", "turn off 499,499 through 500,500"])).toBe((1000 * 1000) - 4);
    expect(partOne(getDayInput(day))).toBe(543903);

    expect(partTwo(["turn on 0,0 through 0,0"])).toBe(1);
    expect(partTwo(["toggle 0,0 through 999,999"])).toBe(2000000);
    expect(partTwo(getDayInput(day))).toBe(14687245);
});
