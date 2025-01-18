import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

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

function step(grid: boolean[][], stickyCorners: boolean = false): boolean[][] {
    const stepped: boolean[][] = grid.map(row => [ ... row]);
    for(let x = 0; x < grid.length; x++) {
        let m = (stickyCorners && (x === 0 || x === grid.length - 1)) ? 1 : 0;
        let n = (stickyCorners && (x === 0 || x === grid.length - 1)) ? grid[x].length - 1 : grid[x].length;
        for(let y = m; y < n; y++) {
            const litNeighbors: number = findNeighbors(grid, { x, y }).filter(coord => grid[coord.x][coord.y]).length;
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

function partTwo(input: string[], steps: number): number {
    let grid: boolean[][] = parseInput(input);
    grid[0][0] = true;
    grid[0][grid[0].length - 1] = true;
    grid[grid.length - 1][0] = true;
    grid[grid.length - 1][grid[0].length - 1] = true;

    for(let i = 0; i < steps; i++) {
        grid = step(grid, true);
    }
    
    return grid.reduce((acc, row) => acc + row.reduce((acc, col) => acc + (col ? 1 : 0), 0), 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 4)).toBe(4);
    expect(partOne(getDayInput(day), 100)).toBe(1061);

    expect(partTwo(getExampleInput(day), 5)).toBe(17);
    expect(partTwo(getDayInput(day), 100)).toBe(1006);

});
