import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day24';

function parseInput(input: string[]): number[] {
    return input.map(line => Number.parseInt(line));
}

function arrangements(weights: number[], targetWeight: number): number[][] {

    let arrangements: number[][] = [];

    weights.sort();

    function backtrack(combination: number[], start: number, sum: number) {
        if (sum === targetWeight) {
            arrangements.push([...combination]);
            return;
        }
        if (sum > targetWeight || start === weights.length) {
            return;
        }

        for (let i = start; i < weights.length; i++) {
            combination.push(weights[i]);
            backtrack(combination, i + 1, sum + weights[i]);
            combination.pop();
        }
    }

    backtrack([], 0, 0);

    return arrangements;

}


function groupPackages(weights: number[]): number[][] {
    let sum: number = weights.reduce((acc, w) => acc + w, 0);
    let targetWeight: number = sum / 3;
    return [ arrangements(weights, targetWeight).sort((a, b) => a.length - b.length)[0] ];
}

function partOne(input: string[]): number {
    const weights: number[] = parseInput(input);
    return groupPackages(weights)[0].reduce((acc, v) => acc * v, 1);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(99);
    expect(partOne(getDayInput(day))).toBe(10723906903);
});
