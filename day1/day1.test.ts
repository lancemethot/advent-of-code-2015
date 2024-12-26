import { getDayInput } from '../utils';

const day = 'day1';

function partOne(input: string[]): number {
    return input.reduce((acc, line) => {
        return line.split('').reduce((acc, chr) => {
            return acc + (chr === '(' ? 1 : -1);
        }, acc);
    }, 0);
}

function partTwo(input: string[]): number {
    let floor: number = 0;
    for(let l = 0; l < input.length; l++) {
        for(let i = 0; i < input[l].length; i++) {
            floor += (input[l][i] === '(' ? 1 : -1);
            if(floor === -1) {
                return ((l + 1) * i) + 1;
            }
        }
    }
    return 0;
}

test(day, () => {

    expect(partOne(["(())"])).toBe(0);
    expect(partOne(["()()"])).toBe(0);

    expect(partOne(["((("])).toBe(3);
    expect(partOne(["(()(()("])).toBe(3);
    expect(partOne(["))((((("])).toBe(3);

    expect(partOne(["())"])).toBe(-1);
    expect(partOne(["))("])).toBe(-1);

    expect(partOne([")))"])).toBe(-3);
    expect(partOne([")())())"])).toBe(-3);

    expect(partOne(getDayInput(day))).toBe(138);

    expect(partTwo([")"])).toBe(1);
    expect(partTwo(["()())"])).toBe(5);

    expect(partTwo(getDayInput(day))).toBe(1771);
});
