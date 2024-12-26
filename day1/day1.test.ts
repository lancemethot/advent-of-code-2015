import { getDayInput } from '../utils';

const day = 'day1';

function partOne(input: string[]): number {
    return input.reduce((acc, line) => {
        return line.split('').reduce((acc, chr) => {
            return acc + (chr === '(' ? 1 : -1);
        }, acc);
    }, 0);
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
});
