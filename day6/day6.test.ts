import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day6';

type Coord = {
    x: number;
    y: number;
}

function executeCommand(grid: boolean[][], line: string): boolean[][] {
    let matches: RegExpMatchArray | null = line.match(/(turn on|turn off|toggle|) (\d+,\d+) through (\d+,\d+)/);
    if(matches !== null) {
        let command: string = matches[1];
        let [a, b]: number[] = matches[2].split(',').map(c => Number.parseInt(c));
        let [c, d]: number[] = matches[3].split(',').map(c => Number.parseInt(c));
        for(let x = a; x <= c; x++) {
            for(let y = b; y <= d; y++) {
                switch(command) {
                    case 'turn on': grid[x][y] = true; break;
                    case 'turn off': grid[x][y] = false; break;
                    default: grid[x][y] = !grid[x][y];
                }
            }
        }
    }
    return grid;
}

function partOne(input: string[]): number {
    let grid: boolean[][] = Array.from({ length: 1000 }, e => Array.from({ length: 1000 }, e => false));
    input.forEach(line => {
        grid = executeCommand(grid, line);
    });
    return grid.reduce((acc, row) => acc + row.filter(col => col).length, 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(["turn on 0,0 through 999,999"])).toBe(1000 * 1000);
    expect(partOne(["toggle 0,0 through 999,0"])).toBe(1000);
    expect(partOne(["turn on 0,0 through 999,999", "toggle 0,0 through 999,0"])).toBe((1000 * 1000) - 1000);
    expect(partOne(["turn off 499,499 through 500,500"])).toBe(0);
    expect(partOne(["turn on 0,0 through 999,999", "turn off 499,499 through 500,500"])).toBe((1000 * 1000) - 4);
    expect(partOne(getDayInput(day))).toBe(543903);
});
