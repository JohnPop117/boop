import { Cat, SizeType } from "../../src/app/lib/definitions";
import {BoopGame} from "../../src/app/lib/BoopGame";

test('construct BoopGame returns game', () => {
    const bg = new BoopGame();
    expect(bg).not.toBe(null);
});

test('construct BoopGame with variable sizes returns game', () => {
    const bg = new BoopGame(1,2);
    expect(bg).not.toBe(null);
    const grid = bg.getGrid();
    expect(grid.length).toEqual(1);
    expect(grid[0].length).toEqual(2);
});

test('placeCat places a cat in a space and removes from player inventory', () => {
    const bg = new BoopGame();
    const player = bg.getPlayer(0);
    expect(player.felines.kittens).toEqual(8);
    bg.placeCat(SizeType.kitten, 0,0,0);
    const catSpace = bg.getGrid()[0][0];
    expect(player.felines.kittens).toEqual(7);
    expect(catSpace).not.toBeNull();
    expect(catSpace?.owner).toEqual(0);
    expect(catSpace?.size).toEqual(SizeType.kitten);
});

test('outofbounds returns false when in bounds', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(0,0)).toEqual(false);
});

test('outofbounds returns true when negative row', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(-1,0)).toEqual(true);
});

test('outofbounds returns true when negative col', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(0,-1)).toEqual(true);
});

test('outofbounds returns true when negative col and row', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(-1,-1)).toEqual(true);
});

test('outofbounds returns true when row equals 6', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(6,0)).toEqual(true);
});

test('outofbounds returns true when col equals 6', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(0,6)).toEqual(true);
});

test('outofbounds returns true when col and row equals 6', () => {
    const bg = new BoopGame();
    expect(bg.outOfBounds(6,6)).toEqual(true);
});

test('movecat moves a cat and sets previous space to null', () => {
    const bg = new BoopGame();

    bg.getGrid()[0][0]= {owner: 0, size: SizeType.kitten};

    expect(bg.moveCat(bg.getGrid()[0][0], 0,0,0,1)).toBe(true);

    expect(bg.getGrid()[0][0]).toBeNull();
    expect(bg.getGrid()[0][1]).toEqual({owner: 0, size: SizeType.kitten});
})

test('movecat does not moves a cat and returns false if a cat exists in new space', () => {
    const bg = new BoopGame();

    bg.getGrid()[0][0]= {owner: 0, size: SizeType.kitten};
    bg.getGrid()[0][1]= {owner: 1, size: SizeType.kitten};

    expect(bg.moveCat(bg.getGrid()[0][0], 0,0,0,1)).toBe(false);

    expect(bg.getGrid()[0][0]).toEqual({owner: 0, size: SizeType.kitten});
    expect(bg.getGrid()[0][1]).toEqual({owner: 1, size: SizeType.kitten});
})

test('ageCat ages a kitten and updates player correctly', () => {
    const bg = new BoopGame();

    bg.getGrid()[0][0]= {owner: 0, size: SizeType.kitten};
    expect(bg.ageCat(0,0)).toBe(true);

    expect(bg.getPlayer(0).felines.kittens).toEqual(7);
    expect(bg.getPlayer(0).felines.cats).toEqual(1);
    expect(bg.getPlayer(0).felines.totalBigCats).toEqual(1);
});

test('ageCat returns false if no cat exists at location', () => {
    const bg = new BoopGame();

    bg.getGrid()[0][0]= {owner: 0, size: SizeType.kitten};
    expect(bg.ageCat(0,1)).toBe(false);

    expect(bg.getPlayer(0).felines.kittens).toEqual(8);
    expect(bg.getPlayer(0).felines.cats).toEqual(0);
    expect(bg.getPlayer(0).felines.totalBigCats).toEqual(0);
});

test('ageCat ages does not age a cat and updates player correctly', () => {
    const bg = new BoopGame();

    bg.getGrid()[0][0]= {owner: 0, size: SizeType.kitten};
    expect(bg.ageCat(0,0)).toBe(true);
    expect(bg.ageCat(0,0)).toBe(false);

    expect(bg.getPlayer(0).felines.kittens).toEqual(7);
    expect(bg.getPlayer(0).felines.cats).toEqual(1);
    expect(bg.getPlayer(0).felines.totalBigCats).toEqual(1);
});

test('checkWon returns true for 3 cats in a row', () =>{
    const grid: Cat[][] = [
        [null, null, null, null, null, null],
        [{owner:0, size: SizeType.cat},{owner:0, size: SizeType.cat},{owner:0, size: SizeType.cat}],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ];
    const bg = new BoopGame(6,6,grid);
    expect(bg.checkWon()).toBe(0);
});
test('checkWon returns true for 3 cats in a column', () =>{
    const grid: Cat[][] = [
        [null,{owner:0, size: SizeType.cat}, null, null, null, null],
        [null, {owner:0, size: SizeType.cat}],
        [null, {owner:0, size: SizeType.cat}],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ];
    const bg = new BoopGame(6,6,grid);
    expect(bg.checkWon()).toBe(0);
});
test('checkWon returns true for 3 cats in a diagonal', () =>{
    const grid: Cat[][] = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, {owner:0, size: SizeType.cat}, null, null, null, null],
        [null, null, {owner:0, size: SizeType.cat}, null, null, null],
        [null, null, null, {owner:0, size: SizeType.cat}, null, null],
    ];
    const bg = new BoopGame(6,6,grid);
    expect(bg.checkWon()).toBe(0);
});
test('checkWon returns true for all cats placed', () =>{
    const bg = new BoopGame();
    bg.getPlayer(0).felines={kittens: 0, cats:8, totalBigCats: 8};
    bg.placeCat(SizeType.cat, 0,0,0);
    bg.placeCat(SizeType.cat, 0,2,0);
    bg.placeCat(SizeType.cat, 0,4,0);
    bg.placeCat(SizeType.cat, 2,0,0);
    bg.placeCat(SizeType.cat, 2,2,0);
    bg.placeCat(SizeType.cat, 2,4,0);
    bg.placeCat(SizeType.cat, 4,0,0);
    bg.placeCat(SizeType.cat, 4,2,0);
    expect(bg.checkWon()).toBe(0);
});
test('checkWon returns false for a grid with no win conditions', () =>{
    const bg = new BoopGame(6,6);
    expect(bg.checkWon()).toBe(-1);
});