import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day19';

type Replacement = {
    from: string;
    to: string;
}

function parseInput(input: string[]): { replacements: Replacement[], start: string } {
    return input.reduce((acc, line) => {
        const parts: string[] = line.split(' => ');
        if(parts.length > 1) {
            acc.replacements.push({ from: parts[0], to: parts[1] });
        } else {
            acc.start = line.trim();
        }
        return acc;
    }, { replacements: [] as Replacement[], start: ''} );
}

function partOne(input: string[]): number {
    const parsed: { replacements: Replacement[], start: string } = parseInput(input);
    const replacements: Replacement[] = parsed.replacements;
    return replacements.reduce((acc, replacement) => {
        // find all indexes of 'from' in 'start' and replace with 'to'
        let index: number = 0;
        while((index = parsed.start.indexOf(replacement.from, index)) >= 0) {
            acc.add(
                parsed.start.substring(0, index) +
                replacement.to +
                parsed.start.substring(index + replacement.from.length)
            );
            index++;
        }
        return acc;
    }, new Set<string>()).size;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day, 1))).toBe(4);
    expect(partOne(getExampleInput(day, 2))).toBe(7);
    expect(partOne(getDayInput(day))).toBe(518);
});
