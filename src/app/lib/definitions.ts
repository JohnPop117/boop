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