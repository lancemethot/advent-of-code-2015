import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day23';

type Instruction = {
    command: string;
    register?: string;
    offset?: number;
}

function parseInput(input: string[]): Instruction[] {
    return input.reduce((acc, line) => {
        if(line.startsWith('jmp')) {
            acc.push({ command: 'jmp', offset: Number.parseInt(line.split(' ')[1].replace('+', ''))});
        } else {
            acc.push({
                command: line.split(' ')[0],
                register: line.split(',')[0].split(' ')[1],
            });
            if(line.indexOf(',') >= 0) {
                acc[acc.length -1].offset = Number.parseInt(line.split(',')[1].trim().replace('+', ''));
            }
        }
        return acc;
    }, [] as Instruction[]);
}

function compute(instructions: Instruction[], registers: Map<string, number>): Map<string, number> {
    for(let i = 0; i < instructions.length; i++) {
        let reg: string = instructions[i].register as string;
        switch(instructions[i].command) {
            case 'hlf':
                registers.set(reg, registers.get(reg)! / 2);
                break;
            case 'tpl':
                registers.set(reg, registers.get(reg)! * 3);
                break;
            case 'inc':
                registers.set(reg, registers.get(reg)! + 1);
                break;
            case 'jmp':
                i = i + instructions[i].offset!;
                i--;
                break;
            case 'jie':
                if(registers.get(reg)! !== 0 && registers.get(reg)! % 2 === 0) {
                    i = i + instructions[i].offset!;
                    i--;
                }
                break;
            case 'jio':
                if(registers.get(reg)! === 1) {
                    i = i + instructions[i].offset!;
                    i--;
                }
                break;
        }
    }
    return registers;
}

function partOne(input: string[]): number {
    const registers: Map<string, number> = new Map();
    registers.set("a", 0);
    registers.set("b", 0);
    return compute(parseInput(input), registers).get("b") as number;
}

function partTwo(input: string[]): number {
    const registers: Map<string, number> = new Map();
    registers.set("a", 1);
    registers.set("b", 0);
    return compute(parseInput(input), registers).get("b") as number;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    const registers: Map<string, number> = new Map();
    registers.set("a", 0);
    registers.set("b", 0);
    expect(compute(parseInput(getExampleInput(day)), registers).get('a')).toBe(2);
    expect(partOne(getExampleInput(day))).toBe(0);
    expect(partOne(getDayInput(day))).toBe(184);

    registers.set("a", 1);
    registers.set("b", 0);
    expect(compute(parseInput(getExampleInput(day)), registers).get('a')).toBe(7);
    expect(partTwo(getExampleInput(day))).toBe(0);
    expect(partTwo(getDayInput(day))).toBe(231);
});
