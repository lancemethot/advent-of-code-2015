import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

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

function partTwo(input: string[], seconds: number): number {
    let reindeer: Reindeer[] = parseInput(input);
    let scoreboard: Map<string, number> = new Map<string, number>();
    reindeer.forEach(deer => scoreboard.set(deer.name, 0));

    // update the scoreboard every second
    for(let i = 1; i <= seconds; i++) {
        // calculate distances for each reindeer
        let distances: Map<string, number> = reindeer.reduce((acc, d) => {
            acc.set(d.name, calculateDistance(d, i));
            return acc;
        }, new Map<string, number>());
        // find the best distance and give a point to each reindeer at the same distance
        let best: number = Array.from(distances.values()).reduce((acc, d) => Math.max(acc, d), 0);
        let leaders: string[] = Array.from(distances.entries()).filter(entry => entry[1] === best).map(entry => entry[0]);
        leaders.forEach(leader => scoreboard.set(leader, scoreboard.get(leader)! + 1));
    }

    // Sort the scoreboard and return the best distance
    return Array.from(scoreboard.values()).sort((a, b) => b - a)[0];
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 1000)).toBe(1120);
    expect(partOne(getDayInput(day), 2503)).toBe(2696);

    expect(partTwo(getExampleInput(day), 1000)).toBe(689);
    expect(partTwo(getDayInput(day), 2503)).toBe(1084);
});
