import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from 'advent-of-code-utils';

const day = 'day13';

type GuestList = Map<string, Map<string, number>>;

type SeatingPlan = HeapItem & {
    arrangement: string[];
}

function parseInput(input: string[]): GuestList {
    return input.reduce((acc, line) => {
        let matches: RegExpMatchArray = line.match(/([a-zA-Z]+) would (gain|lose) (\d+) happiness units by sitting next to ([a-zA-Z]+)./) as RegExpMatchArray;
        if(!acc.has(matches[1])) acc.set(matches[1], new Map<string, number>());
        let weight: number = Number.parseInt(matches[3]);
        if(matches[2] === 'lose') weight = 0 - weight;
        acc.get(matches[1])!.set(matches[4], weight);
        return acc;
    }, new Map() as GuestList);
}

function findSeatingPlansForGuest(map: GuestList, guest: string): SeatingPlan[] {
    let plans: SeatingPlan[] = [];

    let heap: MinHeap<SeatingPlan> = new MinHeap();
    heap.insert({ arrangement: [guest], size: 0 });

    while(heap.size() > 0) {
        let plan: SeatingPlan = heap.extractMin();
        let current: string = plan.arrangement[plan.arrangement.length - 1];
        let next: [string, number][] = Array.from(map.get(current)!);
        next = next.filter(move => !plan.arrangement.includes(move[0]));
        if(next.length === 0) plans.push(plan);
        else next.forEach(neighbor => {
            heap.insert({ arrangement: [ ...plan.arrangement, neighbor[0]], size: plan.size + neighbor[1]});
        });;
    }

    let guestList: number = Array.from(map.keys()).length;
    return plans.filter(route => route.arrangement.length === guestList);
}

function findSeatingPlans(map: GuestList): SeatingPlan[] {
    return Array.from(map.keys()).reduce((acc, location) => {
        return acc.concat(findSeatingPlansForGuest(map, location));
    }, [] as SeatingPlan[]);
}

function scoreSeatingArrangement(map: GuestList, arrangement: string[]): number {
    return arrangement.reduce((acc, guest, index) => {
        let left: string = index === 0 ? arrangement[arrangement.length - 1] : arrangement[index - 1];
        let right: string = index === arrangement.length - 1 ? arrangement[0] : arrangement[index + 1];
        return acc + (map.get(guest)!.get(left)! + map.get(guest)!.get(right)!);
    }, 0);
}

function partOne(input: string[]): number {
    let guests: GuestList = parseInput(input);
    return findSeatingPlans(guests).reduce((acc, seatplan) => {
        return Math.max(acc, scoreSeatingArrangement(guests, seatplan.arrangement));
    }, 0);
}

function partTwo(input: string[]): number {
    let guests: GuestList = parseInput(input);
    guests.set("me", new Map<string, number>());
    guests.keys().forEach(guest => {
        guests.get("me")!.set(guest, 0);
        guests.get(guest)!.set("me", 0);
    });
    return findSeatingPlans(guests).reduce((acc, seatplan) => {
        return Math.max(acc, scoreSeatingArrangement(guests, seatplan.arrangement));
    }, 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(330);
    expect(partOne(getDayInput(day))).toBe(618);

    expect(partTwo(getExampleInput(day))).toBe(286);
    expect(partTwo(getDayInput(day))).toBe(601);
});
