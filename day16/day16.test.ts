import { debug, getDayInput } from '../utils';

const day = 'day16';

type Aunt = {
    id: number;
    info: Map<string, number>;
}

function parseInput(input: string[]): Aunt[] {
    return input.reduce((acc, line) => {
        acc.push({
            id: Number.parseInt(line.substring(0, line.indexOf(':')).split(' ')[1]),
            info: line.substring(line.indexOf(':')+1).split(',').reduce((acc, i) => {
                    acc.set(i.split(': ')[0].trim(), Number.parseInt(i.split(': ')[1]));
                    return acc;
                  }, new Map<string, number>())
        });
        return acc;
    }, [] as Aunt[]);
}

function partOne(input: string[]): number {

    const tape: Map<string, number> = new Map<string, number>();
    tape.set("children", 3);
    tape.set("cats", 7);
    tape.set("samoyeds", 2);
    tape.set("pomeranians", 3);
    tape.set("akitas", 0);
    tape.set("vizslas", 0);
    tape.set("goldfish", 5);
    tape.set("trees", 3);
    tape.set("cars", 2);
    tape.set("perfumes", 1);

    return parseInput(input).filter(aunt => Array.from(aunt.info.entries()).reduce((acc, stat) => acc && tape.get(stat[0]) === stat[1], true))[0].id;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getDayInput(day))).toBe(103);
});
