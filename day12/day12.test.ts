import { debug, getDayInput } from '../utils';

const day = 'day12';

function partOne(input: string[]): number {
    return input.join('')
                .split(/[\[\]\{\},:]/)
                .filter(i => i.trim().length !== 0 && !i.startsWith("\""))
                .reduce((acc, num) => acc + Number.parseInt(num), 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(["[1,2,3]"])).toBe(6);
    expect(partOne(["{\"a\":2,\"b\":4}"])).toBe(6);
    expect(partOne(["[[[3]]]"])).toBe(3);
    expect(partOne(["{\"a\":{\"b\":4},\"c\":-1}"])).toBe(3);
    expect(partOne(["{\"a\":[-1,1]}"])).toBe(0);
    expect(partOne(["[-1,{\"a\":1}]"])).toBe(0);
    expect(partOne(["[]"])).toBe(0);
    expect(partOne(["{}"])).toBe(0);

    expect(partOne(getDayInput(day))).toBe(111754);
});
