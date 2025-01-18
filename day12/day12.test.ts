import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day12';

function partOne(input: string[]): number {
    return input.join('')
                .split(/[\[\]\{\},:]/)
                .filter(i => i.trim().length !== 0 && !i.startsWith("\""))
                .reduce((acc, num) => acc + Number.parseInt(num), 0);
}

function trimRed(item: any): any {
    if(Array.isArray(item)) {
        item = Array.from(item).map(item => trimRed(item));
    } else if(typeof item === 'object') {
        for(const [key, val] of Object.entries(item)) {
            if(val === "red") { item = {}; break; }
            if(typeof val === 'object') item[key] = trimRed(val);
            else if(Array.isArray(val)) item[key] = Array.from(val).map(i => trimRed(i));
        }
    }
    return item;
}

function partTwo(input: string[]): number {
    let parsed: any = trimRed(JSON.parse(input.join('')));
    return JSON.stringify(parsed)
                .split(/[\[\]\{\},:]/)
                .filter(i => i.trim().length !== 0 && !i.startsWith("\""))
                .reduce((acc, num) => acc + Number.parseInt(num), 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(["[1,2,3]"])).toBe(6);
    expect(partOne(["{\"a\":2,\"b\":4}"])).toBe(6);
    expect(partOne(["[[[3]]]"])).toBe(3);
    expect(partOne(["{\"a\":{\"b\":4},\"c\":-1}"])).toBe(3);
    expect(partOne(["{\"a\":[-1,1]}"])).toBe(0);
    expect(partOne(["[-1,{\"a\":1}]"])).toBe(0);
    expect(partOne(["[]"])).toBe(0);
    expect(partOne(["{}"])).toBe(0);

    expect(partOne(getDayInput(day))).toBe(111754);

    expect(partTwo(["[1,2,3]"])).toBe(6);
    expect(partTwo(["[1,{\"c\":\"red\",\"b\":2},3]"])).toBe(4);
    expect(partTwo(["{\"d\":\"red\",\"e\":[1,2,3,4],\"f\":5}"])).toBe(0);
    expect(partTwo(["[1,\"red\",5]"])).toBe(6);

    expect(partTwo(getDayInput(day))).toBe(65402);
});
