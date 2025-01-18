import { debug } from 'advent-of-code-utils';
import { Md5 } from 'ts-md5';

const day = 'day4';

function findHash(input: string, leadingZeroes: number): number {
    let count: number = 0;
    let check: string = '0'.repeat(leadingZeroes);
    while(!Md5.hashStr(input+String(++count)).startsWith(check));
    return count;
}

function partOne(input: string): number {
    return findHash(input, 5);
}

function partTwo(input: string): number {
    return findHash(input, 6);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne("abcdef")).toBe(609043);
    expect(partOne("pqrstuv")).toBe(1048970);
    expect(partOne("iwrupvqb")).toBe(346386);

    expect(partTwo("iwrupvqb")).toBe(9958218);
});
