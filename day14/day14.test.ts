import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day14';

type Reindeer = {
    name: string;
    rate: number;
    duration: number;
    rest: number;
}

function parseInput(input: string[]): Reindeer[] {
    return input.map(line => {
        let matches: RegExpMatchArray = line.match(/([a-zA-Z]+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./) as RegExpMatchArray;
        return {
            name: matches[1],
            rate: Number.parseInt(matches[2]),
            duration: Number.parseInt(matches[3]),
            rest: Number.parseInt(matches[4]),
        };
    });
}

function calculateDistance(reindeer: Reindeer, seconds: number): number {
    let period: number = reindeer.duration + reindeer.rest;
    let distance: number = reindeer.rate * reindeer.duration;
    distance *= Math.floor(seconds / period);
    distance += (seconds % period) > reindeer.duration ? (reindeer.rate * reindeer.duration) : (reindeer.rate * (seconds % period));
    return distance;
}

function partOne(input: string[], seconds: number): number {
    return parseInput(input).reduce((acc, reindeer) => Math.max(acc, calculateDistance(reindeer, seconds)), 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 1000)).toBe(1120);
    expect(partOne(getDayInput(day), 2503)).toBe(2696);
});
