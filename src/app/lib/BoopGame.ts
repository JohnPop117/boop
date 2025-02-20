import { Cat, SizeType, Player, defaultRows, defaultColumns, defaultKittens, checkResult, Direction } from "./definitions";

export class BoopGame {
    private gameGrid: Cat[][];
    private players: Player[];
    private curPlayer = 0;

    static rowDirection: number[] = [-1,-1,-1, 0,0,0, 1,1,1];
    static colDirection: number[] = [-1, 0, 1,-1,0,1,-1,0,1];

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
                // Adjacent space is off the board or there is no cat at the space then do nothing
                if(this.outOfBounds(adjacentR, adjacentC) || grid[adjacentR][adjacentC] == null ){
                    return;
                } else {
                    const feline = grid[adjacentR][adjacentC]
                    // Kitten cannot boop cat
                    if(size == SizeType.kitten && feline.size == SizeType.cat){
                        return;
                    }
                    const newR = adjacentR+row;
                    const newC = adjacentC+col;
    
                    // Cat moved off the board
                    if(this.outOfBounds(newR, newC)){
                        this.removeCat(adjacentR, adjacentC);
                        return;
                    }
    
                    // Check if cat blocked by other cat from moving
                    if(grid[newR][newC] !== null){
                        return;
                    }
    
                    this.moveCat(feline, adjacentR, adjacentC, newR, newC)
                }
            });
        });
    }

    removeCat(row: number, column: number): void {
        const feline = this.gameGrid[row][column]!;
        if(feline.size == SizeType.kitten){
            this.players[feline.owner].felines.kittens++
        } else {
            this.players[feline.owner].felines.cats++
        }
        this.gameGrid[row][column] = null;
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

    needToRemoveCat(): boolean{
        return this.players[this.curPlayer].felines.cats==0 && this.players[this.curPlayer].felines.kittens == 0;
    }
    
    ageCat(row: number, col: number): boolean{
        if(this.gameGrid[row][col] == null)
        {
            return false;
        }
        if(this.gameGrid[row][col].size == SizeType.kitten)
        {
            this.players[this.gameGrid[row][col].owner].felines.totalBigCats++;
        }
        this.gameGrid[row][col].size = SizeType.cat;
        this.removeCat(row, col);
        return true;
    }
    
    checkWon(): number{
        // Has all 8 big cats placed
        for(let playerNum = 0; playerNum < 2; playerNum++){
            if(this.players[playerNum].felines.cats == 0 && this.players[playerNum].felines.totalBigCats == 8)
                {
                    return playerNum;
                }
        }

        if(this.players[this.curPlayer].felines.totalBigCats - this.players[this.curPlayer].felines.cats >= 3)
        {
            // Check if there are 3 big cats in a row
            for(let row: number = 0; row < this.gameGrid.length; row++)
            {
                for(let col = 0; col < this.gameGrid[0].length; col++)
                {
                    if(this.gameGrid[row][col] != null && (this.checkSW(row, col) || this.checkS(row, col) || this.checkSE(row, col) || this.checkE(row, col))){
                        return this.gameGrid[row][col]!.owner;
                    }

                }
            }
        }
        return -1;
    }
    
    checkForThree(): checkResult[]
    {
        const results: checkResult[] = [];
        // Check if there are 3 big cats in a row
        for(let row: number = 0; row < this.gameGrid.length; row++)
        {
            for(let col = 0; col < this.gameGrid[0].length; col++)
            {
                if(this.gameGrid[row][col] != null && this.gameGrid[row][col]!.owner == this.curPlayer)
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
        }
        return results;
    }

    checkSW(row: number, col: number): boolean
    {
        if(row + 2 >= this.gameGrid.length || col - 2 < 0)
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
        if(row + 2 >= this.gameGrid.length)
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
        if(row + 2 >= this.gameGrid.length || col + 2 >= this.gameGrid[0].length)
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
        if(col + 2 >= this.gameGrid[0].length)
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

    getCurPlayer():number{
        return this.curPlayer;
    }

    nextPlayer():void{
        this.curPlayer = (this.curPlayer+1) % 2;
    }
}