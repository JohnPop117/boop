import { Cat, SizeType, Player } from "./definitions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BoopGame {

    private gameGrid: Cat[][];
    private players: Player[];
    private curPlayer = 0;

    static rowDirection: number[] = [-1,-1,-1, 0,0,0, 1,1,1]
    static colDirection: number[] = [-1, 0, 1,-1,0,1,-1,0,1]
    

    constructor(rows: number = 6, columns: number = 6, grid: Cat[][]|null = null){
        this.gameGrid = grid != null ? grid : new Array(rows).fill(null).map(() => new Array(columns).fill(null));
        this.players = [ { id: "1", felines: { kittens: 8, cats: 0, totalBigCats: 0}}, { id: "2", felines: { kittens: 8, cats: 0, totalBigCats: 0}}];
    }

    getGrid(): Cat[][] {
        return this.gameGrid;
    }

    getPlayer(playerNumber: number): Player {
        return this.players[playerNumber];
    }

    /**
     * Atteps to place a cat in the specified space
     * @param size Size of the cat, either a kitten or a cat
     * @param row 
     * @param col 
     * @param player Which player's feline
     * @returns 
     */
    placeCat(size: SizeType, row: number, col: number, player: number) : boolean {
        if(this.gameGrid[row][col] == null){
            if(size == SizeType.kitten){
                if(this.players[player].felines.kittens <= 0){
                    //throw error
                    return false;
                } else {
                    this.players[player].felines.kittens--;
                }
            }
            else if(size == SizeType.cat){
                if(this.players[player].felines.cats <= 0){
                    //throw error
                    return false;
                } else {
                    this.players[player].felines.cats--;
                }
            }
            const cat = {owner: player, size: size};
            this.gameGrid[row][col] = cat;
            this.BoopAction(row, col, this.gameGrid, size);
        }
        return false;
    }

    BoopAction(placedRow: number, placedCol: number, grid: Cat[][], size: SizeType): void{
        // Start top Left of a 3x3 grid

        BoopGame.rowDirection.forEach( row => {
            BoopGame.colDirection.forEach( col =>
            {
                if(row == 0 && col == 0){
                    return;
                }
                const adjacentR = placedRow + row;
                const adjacentC = placedCol + col;
                if(this.outOfBounds(adjacentR, adjacentC) || grid[adjacentR][adjacentC] == null ){
                    return;
                } else {
                    const cat = grid[adjacentR][adjacentC]
                    // Small cannot boop big
                    if(size == SizeType.kitten && cat.size == SizeType.cat){
                        return;
                    }
                    const newR = adjacentR+row
                    const newC = adjacentC+col
    
                    // Cat moved off the board
                    if(this.outOfBounds(newR, newC)){
                        if(cat.size == SizeType.kitten){
                            this.players[cat.owner].felines.kittens++
                        } else {
                            this.players[cat.owner].felines.cats++
                        }
                    }
    
                    // Check if cat blocked by other cat from moving
                    if(grid[newR][newC] !== null){
                        return;
                    }
    
                    this.moveCat(cat, adjacentR, adjacentC, newR, newC)
                }
            });
        });
    }
    
    outOfBounds(row: number, col: number): boolean {
        if(row < 0 || row > 6 || col < 0 || col > 6){
            return true;
        }
        return false;
    }
    
    moveCat(cat: Cat, adjacentR:number, adjacentC: number, newR:number, newC: number): void{
        this.gameGrid[newR][newC] = cat;
        this.gameGrid[adjacentR][adjacentC] = null;
    
    }
    
    ageCat(row: number, col: number): void{
        // TODO validate that there around enough cats to age
        if(this.gameGrid[row][col] == null)
        {
            return;
        }
        this.players[this.gameGrid[row][col].owner].felines.cats++
        if(this.gameGrid[row][col].size == SizeType.kitten)
        {
            this.players[this.gameGrid[row][col].owner].felines.totalBigCats++
        }
    }
    
    checkWon(player: number): boolean{
        // Has all 8 big cats placed
        if(this.players[player].felines.cats == 0 && this.players[player].felines.totalBigCats == 8)
        {
            return true;
        }
    
        // Check if there are 3 big cats in a row
        for(let row: number = 0; row < 3; row++)
        {
            for(let col = 0; col < 3; col++)
            {
    
            }
        }
        return false;
    }
    
    
    checkSW(row: number, col: number): boolean
    {
        if(row + 2 > 0 || col - 2 < 0)
        {
            return false
        }
        this.curPlayer = this.gameGrid[row][col]?.owner ? 0 : 1;
        if(this.gameGrid[row+1][col-1] && this.gameGrid[row+1][col-1]?.owner == this.curPlayer)
        {
            if(this.gameGrid[row+2][col-2] && this.gameGrid[row+2][col-2]?.owner == this.curPlayer)
            {
                return true;
            }
        }
        return false
    }
    
    checkS(row: number, col: number): boolean
    {
        if(row + 2 > 0)
        {
            return false
        }
        this.curPlayer = this.gameGrid[row][col]?.owner ? 0:1;
        if(this.gameGrid[row+1][col] && this.gameGrid[row+1][col]?.owner == this.curPlayer)
        {
            if(this.gameGrid[row+2][col] && this.gameGrid[row+2][col]?.owner == this.curPlayer)
            {
                return true;
            }
        }
        return false
    }
    
    checkSE(row: number, col: number): boolean
    {
        if(row + 2 > 0 || col + 2 < 0)
        {
            return false
        }
        this.curPlayer = this.gameGrid[row][col]?.owner ? 0:1;
        if(this.gameGrid[row+1][col+1] && this.gameGrid[row+1][col+1]?.owner == this.curPlayer)
        {
            if(this.gameGrid[row+2][col+2] && this.gameGrid[row+2][col+2]?.owner == this.curPlayer)
            {
                return true;
            }
        }
        return false
    }

    checkE(row: number, col: number): boolean
    {
        if(col + 2 > 6)
        {
            return false
        }
        this.curPlayer = this.gameGrid[row][col]?.owner ? 0:1;
        if(this.gameGrid[row][col+1] && this.gameGrid[row][col+1]?.owner == this.curPlayer)
        {
            if(this.gameGrid[row][col+2] && this.gameGrid[row][col+2]?.owner == this.curPlayer)
            {
                return true;
            }
        }
        return false
    }
}