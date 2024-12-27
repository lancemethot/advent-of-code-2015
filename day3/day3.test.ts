import { debug, getDayInput } from '../utils';

const day = 'day3';

type Coord = {
    x: number;
    y: number;
}

function move(position: Coord, direction: string): Coord {
    let x: number = position.x;
    let y: number = position.y;
    switch(direction) {
        case '^': x -= 1; break;
        case 'v': x += 1; break;
        case '>': y += 1; break;
        default : y -= 1; break;
    }
    return { x, y };
}

function walk(path: string, start: Coord, steps: Set<string>): Set<string> {
    let walked: Set<string> = new Set(steps);
    let position: Coord = start;
    walked.add("0,0");
    path.split('').forEach(step => {
        position = move(position, step);
        walked.add(`${position.x},${position.y}`);
    });
    return walked;
}

function partOne(input: string[]): number {
    let position: Coord = { x: 0, y: 0 };
    return input.reduce((acc, line) => {
        return walk(line, position, acc);
    }, new Set<string>()).size;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(['>'])).toBe(2);
    expect(partOne(['^>v<'])).toBe(4);
    expect(partOne(['^v^v^v^v^v'])).toBe(2);
    expect(partOne(getDayInput(day))).toBe(2592);
});
