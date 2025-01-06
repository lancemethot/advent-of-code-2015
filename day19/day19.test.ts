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

function replace(molecule: string, find: string, substitute: string): string[] {
    let replaced: string[] = [];
    let index: number = 0;
    while((index = molecule.indexOf(find, index)) >= 0) {
        replaced.push(
            molecule.substring(0, index) +
            substitute +
            molecule.substring(index + find.length)
        );
        index++;
    }
    return replaced;
}

function partOne(input: string[]): number {
    const parsed: { replacements: Replacement[], start: string } = parseInput(input);
    const replacements: Replacement[] = parsed.replacements;
    return replacements.reduce((acc, replacement) => {
        replace(parsed.start, replacement.from, replacement.to).forEach(r => acc.add(r));
        return acc;
    }, new Set<string>()).size;
}

function partTwo(input: string[]): number {
    const parsed: { replacements: Replacement[], start: string } = parseInput(input);
    parsed.replacements.sort((a, b) => b.to.length - a.to.length);

    let shrunk: string = parsed.start;
    let steps: number = 0;

    while(shrunk !== 'e') {
        for(let i = 0; i < parsed.replacements.length; i++) {
            const replaced: string[] = replace(shrunk, parsed.replacements[i].to, parsed.replacements[i].from);
            for(let n = 0; n < replaced.length; n++) {
                shrunk = replaced[n];
                steps++;
                break;
            }
        }
    }

    return steps;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day, 1))).toBe(4);
    expect(partOne(getExampleInput(day, 2))).toBe(7);
    expect(partOne(getDayInput(day))).toBe(518);

    expect(partTwo([...getExampleInput(day, 1), 'e => H', 'e => O'])).toBe(3);
    //expect(partTwo([...getExampleInput(day, 2), 'e => H', 'e => O'])).toBe(6);
    expect(partTwo(getDayInput(day))).toBe(200);
});
