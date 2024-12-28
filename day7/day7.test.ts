import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day7';

type Command = {
    cmd: string;
    op1: string;
    op2: string | null;
    output: string;
}

function parseInput(input: string[]): Command[] {
    return input.reduce((acc, line) => {
        let cmd: string = '';
        let op1: string = '';
        let op2: string | null = null;
        let [command, output] = line.split(' -> ');
        let parts: string[] = command.split(' ');
        switch(parts.length) {
            case 1: op1 = command; break;                                  // Literal or Wire
            case 2: cmd = parts[0]; op1 = parts[1]; break;                 // NOT
            case 3: cmd = parts[1]; op1 = parts[0]; op2 = parts[2]; break; // AND, OR, RSHIFT, LSHIFT 
        }
        return acc.concat({ cmd, op1, op2, output });
    }, [] as Command[]);
}

function getValue(map: Map<string, number>, lookup: string | null): number | null {
    if(lookup === null) return null;
    return lookup.match(/^\d+$/) !== null ? Number.parseInt(lookup) : map.has(lookup) ? map.get(lookup)! : null;
}

function emulateCircuit(commands: Command[]): Map<string, number> {
    let stack: Command[] = [ ...commands ];
    let circuitMap: Map<string, number> = new Map<string, number>();
    while(stack.length > 0) {
        let command: Command = stack.shift()!;
        if(circuitMap.get(command.output) !== undefined) {
            continue;
        }

        // Convert wire or literal to a value
        let op1: number | null = getValue(circuitMap, command.op1);
        let op2: number | null = getValue(circuitMap, command.op2);

        if(op1 === null || (command.op2 !== null && op2 === null)) {
            // Input not ready for command, check again later
            stack.push(command);
        } else {
            // Process input
            switch(command.cmd) {
                case 'NOT': circuitMap.set(command.output, ~op1! & 0xFFFF); break;
                case 'AND': circuitMap.set(command.output, op1! & op2!); break;
                case 'OR': circuitMap.set(command.output, op1! | op2!); break;
                case 'LSHIFT': circuitMap.set(command.output, op1! << op2!); break;
                case 'RSHIFT': circuitMap.set(command.output, op1! >> op2!); break;
                default : circuitMap.set(command.output, op1!);
            }
        }
    }
    return circuitMap;
}

function partOne(input: string[]): number {
    return emulateCircuit(parseInput(input)).get('a')!;
}

function partTwo(input: string[]): number {
    let commands: Command[] = parseInput(input);
    let a: number = emulateCircuit(commands).get('a')!;
    return emulateCircuit([ { cmd: '', op1: ''+a, op2: null, output: 'b' }, ... commands ]).get('a')!;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    const example: Map<string, number> = emulateCircuit(parseInput(getExampleInput(day)));
    expect(example.get('d')).toBe(72);
    expect(example.get('e')).toBe(507);
    expect(example.get('f')).toBe(492);
    expect(example.get('g')).toBe(114);
    expect(example.get('h')).toBe(65412);
    expect(example.get('i')).toBe(65079);
    expect(example.get('x')).toBe(123);
    expect(example.get('y')).toBe(456);

    expect(partOne(getDayInput(day))).toBe(46065);

    expect(partTwo(getDayInput(day))).toBe(14134);
});
