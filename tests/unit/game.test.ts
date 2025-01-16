import { SizeType } from "../../src/app/lib/definitions";
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
