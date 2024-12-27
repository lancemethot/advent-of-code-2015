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

function walk(path: string, start: Coord, steps: Set<string>): [ Coord, Set<string> ] {
    let walked: Set<string> = new Set(steps);
    let position: Coord = start;
    walked.add(`${start.x},${start.y}`);
    path.split('').forEach(step => {
        position = move(position, step);
        walked.add(`${position.x},${position.y}`);
    });
    return [ position, walked ];
}

function partOne(input: string[]): number {
    let start: Coord = { x: 0, y: 0 };
    return input.reduce((acc, line) => {
        [start, acc] = walk(line, start, acc);
        return acc;
    }, new Set<string>()).size;
}

function partTwo(input: string[]): number {
    let santa: Coord = { x: 0, y: 0 };
    let robot: Coord = { x: 0, y: 0 };
    return input.reduce((acc, line) => {
        let santaMoves: string = line.split('').filter((val, index) => index % 2 === 0).join('');
        let robotMoves: string = line.split('').filter((val, index) => index % 2 === 1).join('');
        [santa, acc] = walk(santaMoves, santa, acc);
        [robot, acc] = walk(robotMoves, robot, acc);
        return acc;
    }, new Set<string>()).size;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(['>'])).toBe(2);
    expect(partOne(['^>v<'])).toBe(4);
    expect(partOne(['^v^v^v^v^v'])).toBe(2);
    expect(partOne(getDayInput(day))).toBe(2592);

    expect(partTwo(['^v'])).toBe(3);
    expect(partTwo(['^>v<'])).toBe(3);
    expect(partTwo(['^v^v^v^v^v'])).toBe(11);
    expect(partTwo(getDayInput(day))).toBe(2360);
});
