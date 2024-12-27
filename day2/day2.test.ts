import { debug, getDayInput } from "../utils";

const day = 'day2';

function calculateRequiredPaper(input: string): number {
    const dimensions: number[] = input.split('x').map(dim => Number.parseInt(dim));
    let side1: number = dimensions[0] * dimensions[1];
    let side2: number = dimensions[1] * dimensions[2];
    let side3: number = dimensions[2] * dimensions[0];
    let smallest: number = Math.min(side1, side2, side3);
    const surfaceArea: number = (2 * side1) + (2 * side2) + (2 * side3);
    return smallest + surfaceArea;
}

function partOne(input: string[]): number {
    return input.reduce((acc, line) => acc + calculateRequiredPaper(line), 0);
}

test(day, () => {
    expect(calculateRequiredPaper("2x3x4")).toBe(58);
    expect(calculateRequiredPaper("1x1x10")).toBe(43);
    expect(partOne(getDayInput(day))).toBe(1588178);
});