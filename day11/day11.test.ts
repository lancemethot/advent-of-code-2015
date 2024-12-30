import { debug } from '../utils';

const day = 'day11';

function getLetterRunsAndPairs(password: string): [string[], string[]] {
    let runs: string[] = [];
    let pairs: Set<string> = new Set<string>();
    for(let i = 0; i < password.length; i++) {
        // look for run
        if(i < password.length - 2) {
            let j: number = i;
            while(j < password.length && password.charCodeAt(j+1) === password.charCodeAt(j) + 1) j++;
            if(i + 2 < j) {
                runs.push(password.substring(i, j + 1));
                i = j + 1;
            }
        }
        // check for pair
        if(i > 0 && password[i - 1] === password[i]) pairs.add(password[i]);
    }
    return [ runs, Array.from(pairs) ];
}

function isValidChar(char: string): boolean {
    return char !== 'i' && char !== 'o' && char !== 'l';
}

function isValid(password: string): boolean {
    if(!(password.split('').reduce((acc, chr) => acc && isValidChar(chr), true))) return false;
    let [ runs, pairs ] = getLetterRunsAndPairs(password);
    return runs.length > 0 && pairs.length > 1;
}

const cipher: string = 'bcdefghjjkmmnppqrstuvwxyza';
function increment(password: string, position?: number): string {
    if(position === undefined) position = password.length - 1;
    let chars: string[] = password.split('');
    let next: string = cipher[chars[position].charCodeAt(0) - 97];
    chars.splice(position, 1, next);
    return next === 'a' ? increment(chars.join(''), position - 1) : chars.join('');
}

function addOnePair(password: string, position?: number): string {
    let chars: string[] = password.split('');
    if(position === undefined) position = chars.length - 2;
    let chr: string = chars[position];
    let next: string = chars[position + 1];
    if(next.charCodeAt(0) > chr.charCodeAt(0)) {
        chars = increment(chars.join(''), position).split('');
        chr = chars[position];
    }
    chars[position + 1] = chars[position];
    return chars.join('');
}

function addTwoPair(password: string): string {
    let chars: string[] = addOnePair(password, password.length - 4).split('');
    chars[chars.length - 2 ] = 'a';
    chars[chars.length - 1 ] = 'a';
    return chars.join('');
}

function addRun(password: string, position?: number): string {
    let chars: string[] = password.split('');
    if(position === undefined) position = chars.length - 3;
    let chr: string = chars[position];
    let nxt: string = chars[position + 1];
    let thn: string = chars[position + 2];
    if(chr > 'x' || nxt > 'y' || thn > 'z') {
        // can't make a run beginning with y.. need to increment and start with 'a'
        chars = increment(password, position - 1).split('');
        chars[position] = 'a';
    } else if(chr > 'f' && chr < 'p') {
        // can't make a run beginning with g through o.. next up is p
        chars[position] = 'p';
    }

    chars[position + 1] = String.fromCharCode(chars[position].charCodeAt(0) + 1);
    chars[position + 2] = String.fromCharCode(chars[position + 1].charCodeAt(0) + 1);

    return chars.join('');
}

function addRunOnePair(password: string): string {
    let chars: string[] = addRun(password, password.length - 4).split('');
    chars[chars.length - 1] = chars[chars.length - 2];
    return chars.join('');
}

function addRunTwoPair(password: string): string {
    let chars: string[] = password.split('');
    
    // special case - check need to 'roll-up' from 'xz' scenarios in the run
    for(let i = chars.length - 3; i < chars.length - 2; i++) {
        if(chars[i] > 'x') {
            chars = increment(chars.join(''), chars.length - 6).split('');
            chars.splice(chars.length - 5, 5, 'a', 'a', 'a', 'a', 'a');
            break;
        }
    }

    // Add a pair, fill with 'a's, then add the run and finish with a pair
    chars = addOnePair(chars.join(''), chars.length - 5).split('');
    chars.splice(chars.length - 3, 3, 'a', 'a', 'a');
    chars = addRun(chars.join(''), chars.length - 4).split('');
    return addOnePair(chars.join(''), chars.length - 2);
}

function handleInvalidChars(password: string): string {
    let chars: string[] = password.split('');
    // If any of first 4 chars are invalid -> roll up and return ending with aabcc.
    for(let i = 0; i < chars.length - 4; i++) {
        if(!isValidChar(chars[i])) {
            return (chars.slice(0, i).join('') + String.fromCharCode(chars[i].charCodeAt(0) + 1)).padEnd(4, 'a') + 'abcc';
        }
    }
    // If any of last 4 chars are invalid -> increment and fill with 'a'.
    for(let i = chars.length - 4; i < chars.length; i++) {
        if(!isValidChar(chars[i])) {
            chars = increment(password, i++).split('');
            while(i < chars.length) chars[i++] = 'a';
            return chars.join('');
        }
    }

    return password;
}

function nextPassword(password: string): string {
    let chars: string[] = password.split('');

    // Handle invalid characters (i, o, l)
    password = handleInvalidChars(password);
    if(isValid(password)) {
        // If result is a valid password, return it
        return password;
    }

    // There are 5 possible valid passwords depending on the first 3 characters.
    // The password is either missing a pair, two pairs, a run, a run + pair, or a run + 2 pairs
    // The next valid password will therefore be one of these:
    // - xxxxxx11  (add a pair)
    // - xxxxx123  (add a run)
    // - xxxx11aa  (add two pairs)
    // - xxxx1233  (add a run and a pair)
    // - xxx11233  (add a pair, a run, and a pair)
    // The x's are chars we don't care about. The numbers are what we need to fill in
    // to complete the total set and make it valid. We increment chars only when needed.

    let mutate: string = addOnePair(password);
    if(isValid(mutate)) return mutate;

    mutate = addRun(password);
    if(isValid(mutate)) return mutate;

    mutate = addTwoPair(password);
    if(isValid(mutate)) return mutate;

    mutate = addRunOnePair(password);
    if(isValid(mutate)) return mutate;

    mutate = addRunTwoPair(password);
    return mutate;
}

function partOne(input: string): string {
    return nextPassword(input);
}

function partTwo(input: string): string {
    return nextPassword(increment(nextPassword(input)));
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(increment("xx")).toBe("xy");
    expect(increment("xy")).toBe("xz");
    expect(increment("xz")).toBe("ya");
    expect(increment("ya")).toBe("yb");

    expect(isValid("hijklmmn")).toBe(false);
    expect(isValid("abbceffg")).toBe(false);
    expect(isValid("abbcegjk")).toBe(false);

    expect(partOne("abcdefgh")).toBe("abcdffaa");
    expect(partOne("ghijklmn")).toBe("ghjaabcc");

    expect(partOne("vzbxkghb")).toBe("vzbxxyzz");
    expect(partTwo("vzbxkghb")).toBe("vzcaabcc");
});
