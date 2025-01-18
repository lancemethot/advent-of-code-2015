import { debug } from 'advent-of-code-utils';

const day = 'day20';

function partOne(input: number): number {
    for(let n = 0; n < input; n++) {
        let sum: number = 0;
        let d: number = Math.sqrt(n) + 1;
        for(let i = 1; i <= d; i++) {
            if(n % i === 0) {
                sum += i;
                sum += n / i;
            }
        }
        if(sum * 10 >= input) return n;
    }
    return input;
}

function partTwo(input: number): number {
    for(let n = 0; n < input; n++) {
        let sum: number = 0;
        let d: number = Math.sqrt(n) + 1;
        for(let i = 1; i <= d; i++) {
            if(n % i === 0) {
                if(i <= 50) sum += n / i;
                if(n/i <= 50) sum += i;
            }
        }
        if(sum * 11 >= input) return n;
    }
    return input;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(34000000)).toBe(786240);
    expect(partTwo(34000000)).toBe(831600);
});
