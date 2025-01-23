export type Felines = {
    kittens: number;
    cats: number;
    totalBigCats: number;
}

export enum SizeType {
    kitten = 0,
    cat = 1
}

export type Cat = null | {
    owner: number;
    size: SizeType;
}

export type Game = {
    currentPlayer: number;
    player1: Player;
    player2: Player;
    turn: number;
    grid: Cat[][];
}

export type Player = {
    id: string;
    felines: Felines;
}

export type checkResult = {
    row: number;
    col: number;
    direction: Direction,
    owner: number
}

export enum Direction {
    SW,
    S,
    SE,
    E
}

export const defaultRows = 6;
export const defaultColumns = 6;
export const defaultKittens = 8;