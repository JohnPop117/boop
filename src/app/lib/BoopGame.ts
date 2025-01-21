import { Cat, SizeType, Player } from "./definitions";

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
            return true;
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
        if(row < 0 || row >= 6 || col < 0 || col >= 6){
            return true;
        }
        return false;
    }
    
    moveCat(cat: Cat, originalRow:number, originalCol: number, newR:number, newC: number): boolean{
        if(this.gameGrid[newR][newC] != null || ( Math.abs(originalRow-newR) > 1 || Math.abs(originalCol-newC) > 1)){
            return false;
        }
        this.gameGrid[newR][newC] = cat;
        this.gameGrid[originalRow][originalCol] = null;
        return true;
    }
    
    ageCat(row: number, col: number): boolean{
        // TODO validate that there around enough cats to age
        if(this.gameGrid[row][col] == null)
        {
            return false;
        }
        if(this.gameGrid[row][col].size == SizeType.kitten)
        {
            this.players[this.gameGrid[row][col].owner].felines.kittens--;
            this.players[this.gameGrid[row][col].owner].felines.cats++;
            this.players[this.gameGrid[row][col].owner].felines.totalBigCats++;
            this.gameGrid[row][col].size = SizeType.cat;
            return true;
        }
        return false;
    }
    
    checkWon(): number|undefined{
        // Has all 8 big cats placed
        for(let playerNum = 0; playerNum < 2; playerNum++){
            if(this.players[playerNum].felines.cats == 0 && this.players[playerNum].felines.totalBigCats == 8)
                {
                    return playerNum;
                }
        }
        
        // Check if there are 3 big cats in a row
        for(let row: number = 0; row < 4; row++)
        {
            for(let col = 0; col < 4; col++)
            {
                if(this.checkSW(row, col) || this.checkS(row, col) || this.checkSE(row, col) || this.checkE(row, col)){
                    return this.gameGrid[row][col] ? this.gameGrid[row][col]?.owner : -1;
                }

            }
        }
        return -1;
    }
    
    
    checkSW(row: number, col: number): boolean
    {
        if(row + 2 > 0 || col - 2 < 0)
        {
            return false
        }
        const player = this.gameGrid[row][col]?.owner;
        if(this.gameGrid[row+1][col-1] && this.gameGrid[row+1][col-1]?.owner == player)
        {
            if(this.gameGrid[row+2][col-2] && this.gameGrid[row+2][col-2]?.owner == player)
            {
                return true;
            }
        }
        return false
    }
    
    checkS(row: number, col: number): boolean
    {
        if(row + 2 > 6)
        {
            return false
        }
        const player = this.gameGrid[row][col]?.owner;
        if(this.gameGrid[row+1][col] && this.gameGrid[row+1][col]?.owner == player)
        {
            if(this.gameGrid[row+2][col] && this.gameGrid[row+2][col]?.owner == player)
            {
                return true;
            }
        }
        return false
    }
    
    checkSE(row: number, col: number): boolean
    {
        if(row + 2 > 5 || col + 2 > 5)
        {
            return false
        }
        const player = this.gameGrid[row][col]?.owner;
        if(player == undefined){
            return false;
        }
        console.log("Found cat");
        if(this.gameGrid[row+1][col+1] && this.gameGrid[row+1][col+1]?.owner == player)
        {
            console.log("Found cat2");
            if(this.gameGrid[row+2][col+2] && this.gameGrid[row+2][col+2]?.owner == player)
            {
                console.log("Found cat3");
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
        const player = this.gameGrid[row][col]?.owner;
        if(this.gameGrid[row][col+1] && this.gameGrid[row][col+1]?.owner == player)
        {
            if(this.gameGrid[row][col+2] && this.gameGrid[row][col+2]?.owner == player)
            {
                return true;
            }
        }
        return false
    }
}