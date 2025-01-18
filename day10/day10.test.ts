import { debug } from 'advent-of-code-utils';

const day = 'day10';

function transform(sequence: string): string {
    let newSequence: string = '';
    for(let i = 0; i < sequence.length; ) {
        let chr = sequence[i];
        let j = i + 1;
        while(j < sequence.length && sequence[j] === chr) j++;
        newSequence += `${j - i}${chr}`;
        i = j;
    }
    return newSequence;
}

function generate(start: string, k: number): string {
    let sequence: string = start;
    for(let i = 0; i < k; i++) {
        sequence = transform(sequence);
    }
    return sequence;
}

function partOne(input: string): number {
    return generate(input, 40).length;
}

function partTwo(input: string): number {
    return generate(input, 50).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(transform("1")).toBe("11");
    expect(transform("11")).toBe("21");
    expect(transform("21")).toBe("1211");
    expect(transform("1211")).toBe("111221");
    expect(transform("111221")).toBe("312211");

    expect(partOne("1113122113")).toBe(360154);
    expect(partTwo("1113122113")).toBe(5103798);
});
