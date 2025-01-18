import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day17';

function calculateCapacity(container: number[], quantities: number[]) : number {
    return quantities.reduce((acc, q, index) => {
        return acc + (container[index] * q);
    }, 0);
}

function determineCombinations(containers: number[]): number[][] {
    const combos: number[][] = [];
    const queue: number[][] = [];

    queue.push([]);

    while(queue.length > 0) {
        const quantities: number[] = queue.pop() as number[];
        if(quantities.length < containers.length) {
            queue.push(quantities.concat(1));
            queue.push(quantities.concat(0));
        } else {
            combos.push(quantities);
        }
    }

    return combos;
}

function partOne(input: string[], size: number): number {
    const containers: number[] = input.map(line => Number.parseInt(line));
    return determineCombinations(containers)
                .filter(combination => size === calculateCapacity(containers, combination))
                .length;
}

function partTwo(input: string[], size: number): number {
    const containers: number[] = input.map(line => Number.parseInt(line));
    const combinations: number[][] = determineCombinations(containers)
                .filter(combination => size === calculateCapacity(containers, combination));
    const fewest: number = combinations.reduce((acc, combination) => {
        return Math.min(acc, combination.reduce((acc, n) => acc + n, 0));
    }, Infinity);
    return combinations.filter(combination => fewest === combination.reduce((acc, n) => acc + n, 0)).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 25)).toBe(4);
    expect(partOne(getDayInput(day), 150)).toBe(1638);

    expect(partTwo(getExampleInput(day), 25)).toBe(3);
    expect(partTwo(getDayInput(day), 150)).toBe(17);
});
