import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day15';

type Ingredient = {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
}

function parseInput(input: string[]): Ingredient[] {
    return input.map(line => {
        let name = line.split(':')[0];
        let [ capacity, durability, flavor, texture, calories ] = line.split(':')[1].split(',').map(l => Number.parseInt(l.trim().split(' ')[1]));
        return { name, capacity, durability, flavor, texture, calories };
    });
}

function calculateScore(ingredients: Ingredient[], quantities: number[]): number {
    let total: Ingredient = ingredients.reduce((acc, ingredient, index) => {
        acc.capacity += ingredient.capacity * quantities[index];
        acc.durability += ingredient.durability * quantities[index];
        acc.flavor += ingredient.flavor * quantities[index];
        acc.texture += ingredient.texture * quantities[index];
        return acc;
    }, { name: 'total', capacity: 0, durability: 0, flavor: 0, texture: 0, calories: 0 });
    if(total.capacity < 0 || total.durability < 0 || total.flavor < 0 || total.texture < 0) return 0;
    return total.capacity * total.durability * total.flavor * total.texture;
}

function countCalories(ingredients: Ingredient[], quantities: number[]): number {
    let total: Ingredient = ingredients.reduce((acc, ingredient, index) => {
        acc.calories += ingredient.calories * quantities[index];
        return acc;
    }, { name: 'total', capacity: 0, durability: 0, flavor: 0, texture: 0, calories: 0 });
    if(total.calories < 0) return 0;
    return total.calories;
}

function determineRecipes(ingredients: Ingredient[]): number[][] {
    const max: number = 100;
    const cookies: number[][] = [];
    const queue: number[][] = [];

    queue.push([]);

    while(queue.length > 0) {
        const quantities: number[] = queue.pop() as number[];
        if(quantities.length < ingredients.length) {
            let remaining: number = max - quantities.reduce((acc, q) => acc + q, 0);
            if(quantities.length < ingredients.length - 1) {
                for(let i = remaining; i > (ingredients.length - quantities.length); i--) {
                    queue.push(quantities.concat(i));
                }
            } else {
                queue.push(quantities.concat(remaining));
            }
        } else {
            cookies.push(quantities);
        }
    }

    return cookies;
}

function partOne(input: string[]): number {
    const ingredients: Ingredient[] = parseInput(input);
    return determineRecipes(parseInput(input)).reduce((acc, recipe) => Math.max(acc, calculateScore(ingredients, recipe)), 0);
}

function partTwo(input: string[]): number {
    const ingredients: Ingredient[] = parseInput(input);
    return determineRecipes(parseInput(input))
                .filter(recipe => countCalories(ingredients, recipe) === 500)
                .reduce((acc, recipe) => Math.max(acc, calculateScore(ingredients, recipe)), 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(62842880);
    expect(partOne(getDayInput(day))).toBe(21367368);

    expect(partTwo(getExampleInput(day))).toBe(57600000);
    expect(partTwo(getDayInput(day))).toBe(1766400);
});
