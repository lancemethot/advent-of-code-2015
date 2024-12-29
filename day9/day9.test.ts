import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from '../utils';

const day = 'day9';

type Routes = Map<string, Map<string, number>>;

type Route = HeapItem & {
    flightplan: string[];
}

function parseInput(input: string[]): Routes {
    return input.reduce((acc, line) => {
        let from: string = line.split(' to ')[0];
        let to: string = line.split(' to ')[1].split(' = ')[0];
        let distance: number = Number.parseInt(line.split(' to ')[1].split(' = ')[1]);
        if(!acc.has(from)) acc.set(from, new Map<string, number>());
        if(!acc.has(to)) acc.set(to, new Map<string, number>);
        acc.get(from)!.set(to, distance);
        acc.get(to)!.set(from, distance);
        return acc;
    }, new Map() as Routes);
}

function findRoutesFromLocation(map: Routes, location: string): Route[] {
    let routes: Route[] = [];

    let heap: MinHeap<Route> = new MinHeap();
    heap.insert({ flightplan: [location], size: 0 });

    while(heap.size() > 0) {
        let route: Route = heap.extractMin();
        let current: string = route.flightplan[route.flightplan.length - 1];
        let next: [string, number][] = Array.from(map.get(current)!);
        next = next.filter(move => !route.flightplan.includes(move[0]));
        if(next.length === 0) routes.push(route);
        else next.forEach(destination => {
            heap.insert({ flightplan: [ ...route.flightplan, destination[0]], size: route.size + destination[1]});
        });;
    }

    let routeSize: number = Array.from(map.keys()).length;
    return routes.filter(route => route.flightplan.length === routeSize);
}

function findRoutes(map: Routes): Route[] {
    return Array.from(map.keys()).reduce((acc, location) => {
        return acc.concat(findRoutesFromLocation(map, location));
    }, [] as Route[]);
}

function partOne(input: string[]): number {
    return findRoutes(parseInput(input)).reduce((acc, route) => {
        return Math.min(acc, route.size);
    }, Infinity);
}

function partTwo(input: string[]): number {
    return findRoutes(parseInput(input)).reduce((acc, route) => {
        return Math.max(acc, route.size);
    }, 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(605);
    expect(partOne(getDayInput(day))).toBe(251);

    expect(partTwo(getExampleInput(day))).toBe(982);
    expect(partTwo(getDayInput(day))).toBe(898);
});
