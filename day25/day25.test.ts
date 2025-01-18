import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day25';

type Coord = {
    x: number;
    y: number;
}

function parseInput(input: string[]): Coord {
    let match = input[0].match(/.+row (\d+), column (\d+)/) as RegExpMatchArray;
    return {
        x: Number.parseInt(match[1]),
        y: Number.parseInt(match[2])
    };
}

function next(previous: number): number {
    return (previous * 252533) % 33554393;
}

function partOne(input: string[]): number {

    let stop: Coord = parseInput(input);
    let x: number = 1;
    let y: number = 1;
    let r: number = 1;
    let result: number = 20151125;

    while(true) {
        if(x === stop.x && y === stop.y) {
            return result;
        }

        result = next(result);

        if(x === 1) {
            r++;
            x = r;
            y = 1;
        } else {
            x--;
            y++;
        }
    }

}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(9250759);
    expect(partOne(getDayInput(day))).toBe(19980801);
});
