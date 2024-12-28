import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day8';

function determineMemoryLength(str: string): number {
    let distilled: string = '';
    for(let i = 0; i < str.length; i++) {
        if(str[i] === '\\') {
            if(str[i + 1] === '\\') distilled += '\\';
            if(str[i + 1] === '"') distilled += '"';
            if(str[i + 1] === 'x') {
                distilled += String.fromCharCode(parseInt(str.substring(i + 2, i + 4), 16))
                i = i + 2;
            }
            i = i + 1;
        } else {
            distilled += str[i];
        }
    }
    return distilled.length - 2;
}

function partOne(input: string[]): number {
    return input.reduce((acc, line) => {
        return acc + (line.length - determineMemoryLength(line));
    }, 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(12);
    expect(partOne(getDayInput(day))).toBe(1342);
});
