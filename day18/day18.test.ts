import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day18';

type Coord = {
    x: number;
    y: number;
}

function parseInput(input: string[]): boolean[][] {
    return input.reduce((acc, line) => {
        acc.push(line.split('').map(c => c === '#'));
        return acc;
    }, [] as boolean[][]);
}

function isInBounds(grid: boolean[][], position: Coord): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < grid.length && position.y < grid[0].length;
}

function findNeighbors(grid: boolean[][], position: Coord): Coord[] {
    return [ { x: position.x - 1, y: position.y - 1 },
             { x: position.x - 1, y: position.y     },
             { x: position.x - 1, y: position.y + 1 },
             { x: position.x    , y: position.y - 1 },
             { x: position.x    , y: position.y + 1 },
             { x: position.x + 1, y: position.y - 1 },
             { x: position.x + 1, y: position.y     },
             { x: position.x + 1, y: position.y + 1 },
           ].filter(coord => isInBounds(grid, coord));
}

function step(grid: boolean[][]): boolean[][] {
    const stepped: boolean[][] = grid.map(row => [ ... row]);
    for(let x = 0; x < grid.length; x++) {
        for(let y= 0; y < grid[x].length; y++) {
            const litNeighbors: number = findNeighbors(grid, { x, y }).filter(coord=> grid[coord.x][coord.y]).length;
            if(grid[x][y]) {
                stepped[x][y] = (litNeighbors === 2 || litNeighbors === 3);
            } else {
                stepped[x][y] = litNeighbors === 3;
            }
        }
    }
    return stepped;
}

function partOne(input: string[], steps: number): number {
    let grid: boolean[][] = parseInput(input);
    for(let i = 0; i < steps; i++) {
        grid = step(grid);
    }
    return grid.reduce((acc, row) => acc + row.reduce((acc, col) => acc + (col ? 1 : 0), 0), 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 4)).toBe(4);
    expect(partOne(getDayInput(day), 100)).toBe(1061);
});
