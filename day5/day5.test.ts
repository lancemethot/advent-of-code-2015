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

function isNice2(code: string): boolean {
    let pairs: Map<string, number[]> = new Map<string, number[]>();
    let hasSandwich: boolean = false;
    let hasPairs: boolean = false;
    let chars: string[] = code.split('');
    for(let i = 1; i < chars.length; i++) {
        let pair: string = `${chars[i - 1]}${chars[i]}`;
        let prev: string = chars[i - 1 ];
        let next: string = (i < chars.length - 1) ? chars[i + 1] : '';

        hasSandwich = hasSandwich || (prev === next);

        if(pairs.has(pair)) pairs.get(pair)!.push(i);
        else pairs.set(pair, [i]);
    }

    hasPairs = Array.from(pairs).filter(pair => pair[1].length > 1).reduce((acc, pair) => {
        return acc || pair[1].length > 2 || pair[1].reduce((acc, p, index) => {
            return acc || (index > 0 ? p - pair[1][index - 1] > 1 : false);
        }, false);
    }, false);

    return hasPairs && hasSandwich;
}

function partOne(input: string[]): number {
    return input.filter(isNice).length;
}

function partTwo(input: string[]): number {
    return input.filter(isNice2).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(isNice("ugknbfddgicrmopn")).toBe(true);
    expect(isNice("aaa")).toBe(true);
    expect(isNice("jchzalrnumimnmhp")).toBe(false);
    expect(isNice("haegwjzuvuyypxyu")).toBe(false);
    expect(isNice("dvszwmarrgswjxmb")).toBe(false);
    expect(partOne(getDayInput(day))).toBe(236);

    expect(isNice2("qjhvhtzxzqqjkmpb")).toBe(true);
    expect(isNice2("xxyxx")).toBe(true);
    expect(isNice2("uurcxstgmygtbstg")).toBe(false);
    expect(isNice2("ieodomkazucvgmuy")).toBe(false);
    expect(partTwo(getDayInput(day))).toBe(51);
});
