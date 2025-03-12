import { cellState, SizeType } from '../lib/definitions'
import { BoopGame } from '../lib/BoopGame'
import React from 'react'

export function Cell ({testid, state, game, OpenCellMenu, OnClose, PlaceFeline, row, column, RemoveCatAction}:{testid:string, state:cellState, game:BoopGame, OpenCellMenu:(row:number, columnn:number)=>void, OnClose:(row:number, column:number)=>void, PlaceFeline:(size:SizeType, rowIndex:number, columnIndex:number)=>void, row:number, column:number, RemoveCatAction:(row:number, columnn:number)=>void}) {
    return <div>
        {
            game.getGrid()[row][column] !== null ? 
                game.getGrid()[row][column]?.owner==0 ? 
                    game.getGrid()[row][column]?.size == SizeType.kitten ? 
                        <img data-testid={`${testid}-p0-kitten`} style={state == cellState.remove || state == cellState.age ? {border: "5px solid red"}: {}} width={100} height={100} onClick={state == cellState.remove ? () => RemoveCatAction(row, column): ()=>{}}  src="/BlackKitten.png" alt="Player 0 kitten"  /> :
                    <img data-testid={`${testid}-p0-cat`} style={state == cellState.remove || state == cellState.age ? {border: "5px solid red"}: {}} onClick={state == cellState.remove ? () => RemoveCatAction(row, column): ()=>{}} width={100} height={100} src="/BlackAdultCat.png" alt="Player 0 cat"  /> : 
                game.getGrid()[row][column]?.size == SizeType.kitten ? 
                    <img data-testid={`${testid}-p1-kitten`} style={state == cellState.remove || state==cellState.age ? {border: "5px solid red"}: {}} onClick={state == cellState.remove ? () => RemoveCatAction(row, column): ()=>{}} width={100} height={100} src="/CalicoKitten.png" alt="Player 1 kitten"  /> :
                <img data-testid={`${testid}-p0-cat`} style={state == cellState.remove || state == cellState.age ? {border: "5px solid red"}: {}} onClick={state == cellState.remove ? () => RemoveCatAction(row, column): ()=>{}} width={100} height={100} src="/CalicoAdultCat.png" alt="Player 1 cat"  />:
            state != cellState.menu ? 
                <button data-testid={`${testid}-square`} className="grid-button" onClick={() => {OpenCellMenu(row, column)}}>
                    <img width={100} height={100} src="/square.png" alt="Empty Square" />
                </button>  :
                CellMenu({game, rowIndex:row, columnIndex:column, OnClose, PlaceFeline})
        }
    </div>
}

export function CellMenu ({game, rowIndex, columnIndex, OnClose, PlaceFeline}:{game:BoopGame, rowIndex:number, columnIndex:number, OnClose:(row:number, col:number)=> void, PlaceFeline:(size:SizeType, rowIndex:number, columnIndex:number)=>void}) {
    return <div>
        <p>
        {game.getPlayer(game.getCurPlayer()).felines.kittens > 0 ? <button data-testid="place-kitten-button" onClick={() =>{PlaceFeline(SizeType.kitten, rowIndex, columnIndex)} }>Kitten</button>:  false }
        </p>
        <p>
        {game.getPlayer(game.getCurPlayer()).felines.cats > 0 ? <button data-testid="place-cat-button" onClick={() => {PlaceFeline(SizeType.cat, rowIndex, columnIndex)}}>Cat</button>: false}
        </p>
        <button className="grid-button" data-testid="close-menu-button" onClick={() => OnClose(rowIndex, columnIndex)}>Close</button>
    </div>
}