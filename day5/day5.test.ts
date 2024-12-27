import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day5';

function isNice(code: string): boolean {
    // reject if naughty listed
    let naughty: boolean = ['ab', 'cd', 'pq', 'xy'].reduce((acc, pair) => {
        return acc || code.includes(pair);
    }, false);
    if(naughty) return false;
    let vowelCount: number = 0;
    let doublesCount: number = 0;
    code.split('').forEach(chr => {
        vowelCount += ('aeiou'.includes(chr) ? 1 : 0);
        doublesCount += (code.includes(`${chr}${chr}`) ? 1 : 0);
    });
    return vowelCount > 2 && doublesCount > 0;
}

function partOne(input: string[]): number {
    return input.filter(isNice).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(isNice("ugknbfddgicrmopn")).toBe(true);
    expect(isNice("aaa")).toBe(true);
    expect(isNice("jchzalrnumimnmhp")).toBe(false);
    expect(isNice("haegwjzuvuyypxyu")).toBe(false);
    expect(isNice("dvszwmarrgswjxmb")).toBe(false);

    expect(partOne(getDayInput(day))).toBe(236);
});
