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


function groupPackages(weights: number[], groups: number): number {
    let sum: number = weights.reduce((acc, w) => acc + w, 0);
    let targetWeight: number = sum / groups;
    let groupings: number[][] = arrangements(weights, targetWeight);
    let fewest: number = groupings.reduce((acc, g) => Math.min(g.length, acc), Infinity);
    return groupings.filter(g => g.length === fewest)
                    .map(g => g.reduce((acc, w) => acc * w, 1))
                    .sort((a, b) => a - b)[0];
}

function partOne(input: string[]): number {
    return groupPackages(parseInput(input), 3);
}

function partTwo(input: string[]): number {
    return groupPackages(parseInput(input), 4);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(99);
    expect(partOne(getDayInput(day))).toBe(10723906903);

    expect(partTwo(getExampleInput(day))).toBe(44);
    expect(partTwo(getDayInput(day))).toBe(74850409);
});
