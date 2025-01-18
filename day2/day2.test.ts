import { getDayInput } from "advent-of-code-utils";

const day = 'day2';

function calculateRequiredPaper(input: string): number {
    const dimensions: number[] = input.split('x').map(dim => Number.parseInt(dim));
    const side1: number = dimensions[0] * dimensions[1];
    const side2: number = dimensions[1] * dimensions[2];
    const side3: number = dimensions[2] * dimensions[0];
    const smallest: number = Math.min(side1, side2, side3);
    const surfaceArea: number = (2 * side1) + (2 * side2) + (2 * side3);
    return smallest + surfaceArea;
}

function calculateRequiredRibbon(input: string): number {
    const dimensions: number[] = input.split('x').map(dim => Number.parseInt(dim));
    const side1: number = 2 * (dimensions[0] + dimensions[1]);
    const side2: number = 2 * (dimensions[1] + dimensions[2]);
    const side3: number = 2 * (dimensions[2] + dimensions[0]);
    const present: number = Math.min(side1, side2, side3);
    const bow: number = dimensions[0] * dimensions[1] * dimensions[2];
    return present + bow;
}

function partOne(input: string[]): number {
    return input.reduce((acc, line) => acc + calculateRequiredPaper(line), 0);
}

function partTwo(input: string[]): number {
    return input.reduce((acc, line) => acc + calculateRequiredRibbon(line), 0);
}

test(day, () => {
    expect(calculateRequiredPaper("2x3x4")).toBe(58);
    expect(calculateRequiredPaper("1x1x10")).toBe(43);
    expect(partOne(getDayInput(day))).toBe(1588178);

    expect(calculateRequiredRibbon("2x3x4")).toBe(34);
    expect(calculateRequiredRibbon("1x1x10")).toBe(14);
    expect(partTwo(getDayInput(day))).toBe(3783758);
});