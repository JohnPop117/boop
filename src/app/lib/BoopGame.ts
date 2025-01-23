import { Cat, SizeType, Player, defaultRows, defaultColumns, defaultKittens, checkResult, Direction } from "./definitions";

export class BoopGame {

    // TODO: If all 8 peices are on the board after booping and it is the players turn, they can either age a kitten or take a Cat off the board
    // TODO: If 8 felines on the board and you have a 3 in a row after booping, only activate one option
    // TODO: Return a checkResult to show all group of 3 felines to remove from the board


    private gameGrid: Cat[][];
    private players: Player[];
    private curPlayer = 0;

    static rowDirection: number[] = [-1,-1,-1, 0,0,0, 1,1,1]
    static colDirection: number[] = [-1, 0, 1,-1,0,1,-1,0,1]
    

    constructor(rows: number = defaultRows, columns: number = defaultColumns, grid: Cat[][]|null = null){

        this.gameGrid = grid != null ? grid : new Array(rows).fill(null).map(() => new Array(columns).fill(null));
        this.players = [ { id: "1", felines: { kittens: defaultKittens, cats: 0, totalBigCats: 0}}, { id: "2", felines: { kittens: defaultKittens, cats: 0, totalBigCats: 0}}];
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
            // Check if won
            const winner = this.checkWon();
            if(winner > 0){

            }

            // Check if 8 felines on the board to age/remove one
            const allFelinesPlayed = this.players[this.curPlayer].felines.cats==0 && this.players[this.curPlayer].felines.kittens == 0;
            // Check for 3
            const groups = this.checkForThree();
            if(groups.length > 0){
                if(allFelinesPlayed){
                    
                }

            }
            // Show win or choose options from 8 or 3
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
        if(row < 0 || row >= this.gameGrid.length || col < 0 || col >= this.gameGrid[0].length){
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
    
    checkWon(): number{
        // Has all 8 big cats placed
        for(let playerNum = 0; playerNum < 2; playerNum++){
            if(this.players[playerNum].felines.cats == 0 && this.players[playerNum].felines.totalBigCats == 8)
                {
                    return playerNum;
                }
        }
        
        // Check if there are 3 big cats in a row
        for(let row: number = 0; row < this.gameGrid.length; row++)
        {
            for(let col = 0; col < this.gameGrid[0].length; col++)
            {
                if(this.checkSW(row, col) || this.checkS(row, col) || this.checkSE(row, col) || this.checkE(row, col)){
                    return this.gameGrid[row][col]!.owner;
                }

            }
        }
        return -1;
    }
    
    checkForThree(): checkResult[]
    {
        const results: checkResult[] = [];
        // Check if there are 3 big cats in a row
        for(let row: number = 0; row < this.gameGrid.length-2; row++)
        {
            for(let col = 0; col < this.gameGrid[0].length-2; col++)
            {
                if(this.checkSW(row, col))
                {
                    results.push({row: row, col: col, direction: Direction.SW, owner: this.gameGrid[row][col]!.owner});
                }
                if(this.checkS(row, col))
                {
                    results.push({row: row, col: col, direction: Direction.S, owner: this.gameGrid[row][col]!.owner});
                }
                if(this.checkSE(row, col))
                {
                    results.push({row: row, col: col, direction: Direction.SE, owner: this.gameGrid[row][col]!.owner});
                }
                if(this.checkE(row, col))
                {
                    results.push({row: row, col: col, direction: Direction.E, owner:this.gameGrid[row][col]!.owner});
                }
            }
        }
        return results;
    }

    checkSW(row: number, col: number): boolean
    {
        if(row + 3 > this.gameGrid.length || col - 2 < 0 || this.gameGrid[row][col] == null)
        {
            return false
        }
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
        if(row + 3 > this.gameGrid.length || this.gameGrid[row][col] == null)
        {
            return false
        }
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
        if(row + 3 > this.gameGrid.length || col + 3 > this.gameGrid[0].length || this.gameGrid[row][col] == null)
        {
            return false
        }
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
        if(col + 3 > this.gameGrid[0].length || this.gameGrid[row][col] == null)
        {
            return false
        }
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