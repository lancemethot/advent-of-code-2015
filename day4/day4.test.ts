import { debug } from '../utils';
import { Md5 } from 'ts-md5';

const day = 'day4';

function partOne(input: string): number {
    let count: number = 0;
    while(!Md5.hashStr(input+String(++count)).startsWith('00000'));
    return count;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne("abcdef")).toBe(609043);
    expect(partOne("pqrstuv")).toBe(1048970);
    expect(partOne("iwrupvqb")).toBe(346386);
});
