import { debug } from '../utils';

const day = 'day20';

function sumOfPresents(n: number): number {
    let sum: number = 0;
    let d: number = Math.sqrt(n) + 1;
    for(let i = 1; i <= d; i++) {
        if(n % i === 0) {
            sum += i;
            sum += n / i;
        }
    }
    return sum * 10;
}

function partOne(input: number): number {
    let i: number = 1;
    while(sumOfPresents(i++) < input);
    return i - 1;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(34000000)).toBe(786240);
});
