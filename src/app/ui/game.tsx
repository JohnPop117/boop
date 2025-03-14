'use client'
import React, {useState} from 'react';
import './game.css';
import Modal from 'react-modal';
import { BoopGame } from '../lib/BoopGame';
import { checkResult, SizeType, Direction, cellState } from '../lib/definitions';
import { Cell } from './Cell';
import {createRoot} from 'react-dom/client';

enum ActionState {
    place,
    pending,
    remove,
    age,
    gameover
}

Modal.setAppElement('body'); // This line is required for accessibility


// style={state == cellState.remove ? {border: "5px solid red"}: {}} 
const AgeSelection = ({ageCatsArray, ageCatButton, nextAgeGroup, ageCatAction, actionState}:{ageCatsArray:checkResult[], ageCatButton:()=>void, nextAgeGroup:()=>void, ageCatAction:()=>void, actionState:ActionState}) => (
    <div>
        {
            ageCatsArray.length > 0  && actionState == ActionState.pending ? 
                <button data-testid="choose-to-age-button" onClick={ageCatButton}>Choose to age cats</button> :
            
                ageCatsArray.length > 1 && actionState == ActionState.age ?
                    <div>
                        <button data-testid="next-age-button" onClick={nextAgeGroup}>
                            Next
                        </button>
                        <button data-testid="age-button" onClick={ageCatAction}>
                            Age
                        </button>
                    </div>     
                : ageCatsArray.length > 0 ?
                    <div>
                        <button data-testid="age-button"onClick={ageCatAction}>
                            Age
                        </button>
                    </div>
                : false
        }

    </div>
)

const ReactBoopGame = () => {
    const [selectedButton, setSelectedButton] = useState({row:0, column:0});
    const [gridState, setGridState] = useState(Array(6).fill(Array(6).fill(cellState.square)))
    const [game, setGame] = useState(new BoopGame);
    const [removeCat, setRemoveCat] = useState(false);
    const [ageCats, setAgeCats] = useState(Array(0));
    const [action, setAction] = useState(ActionState.place);
    const [selectionIndex, setSelectionIndex] = useState(0);

    const openCellMenu = async (row:number, column:number) => {
        
      setGridState(prevGridState => {
        const newGridState = prevGridState.map(row => row.slice());
            newGridState[selectedButton.row][selectedButton.column] = cellState.square;
        return newGridState;
      });

      const button = {row,column};
      setSelectedButton(button);
        setGridState(prevGridState => {
            const newGridState = prevGridState.map(row => row.slice());

            newGridState[button.row][button.column] = cellState.menu;
            return newGridState;
          });
    }

    const nextAgeGroup = () => {
        let cats = ageCats[selectionIndex];
        setGridState(prevGridState => {
            const newGridState = prevGridState;
            let rowDelta = cats.direction == Direction.E ? 0 : -1;
            let colDelta = (cats.direction == Direction.E  || cats.direction == Direction.SE) ? 1 : cats.direction == Direction.S ? 0: cats.direction == Direction.SW ? -1: 0;
            for(let i = 0; i < 3; i++) {
                newGridState[cats.row+(i*rowDelta)][cats.col+(i*colDelta)] = cellState.square;
            }
            const newIndex = (selectionIndex+1) % ageCats.length;
            cats = ageCats[newIndex];
            rowDelta = cats.direction == Direction.E ? 0 : -1;
            colDelta = (cats.direction == Direction.E  || cats.direction == Direction.SE) ? 1 : cats.direction == Direction.S ? 0: cats.direction == Direction.SW ? -1: 0;
            for(let i = 0; i < 3; i++) {
                newGridState[cats.row+(i*rowDelta)][cats.col+(i*colDelta)] = cellState.age;
            }
            setSelectionIndex((selectionIndex+1) % ageCats.length)
            return newGridState;
          });
        
        
    }

    const closeCellMenu = (rowIndex:number, columnIndex:number) => {
        setSelectedButton({row:rowIndex, column:columnIndex});
        setGridState(prevGridState => {
          const newGridState = prevGridState.map(row => row.slice());
              newGridState[rowIndex][columnIndex] = cellState.square;
          return newGridState;
        });
    }

    const Restart = ({text}:{text:string}) => (
        <div>
            <button data-testid={`${text}-button`} onClick={() => {
              setSelectedButton({row:0, column:0});
              setGridState(Array(6).fill(Array(6).fill(cellState.square)))
              setGame(new BoopGame());
              setRemoveCat(false);
              setAgeCats(Array(0));
              setAction(ActionState.place);
              setSelectionIndex(0);
            }}>{text}</button>
        </div>
    )

    const WonWindow = () => (
    <Modal data-testid="won-window" isOpen={action==ActionState.gameover}>
        <h2>Winner: Player {game.getCurPlayer()}</h2>
            <Restart
                text="Play Again">
            </Restart>
    </Modal>
    );

    const placeFeline = (size: SizeType, rowIndex:number, columnIndex:number) =>{
        if(game.placeCat(size, rowIndex, columnIndex, game.getCurPlayer())){
            const winner = game.checkWon();
            if(winner >= 0)
            {
                setAction(ActionState.gameover);
            } else // no winner
            {
                const catsToAge = game.checkForThree();
                const shouldRemoveCat = game.needToRemoveCat();
                setRemoveCat(shouldRemoveCat)
                setAgeCats(catsToAge);
                if(catsToAge.length == 0 && !shouldRemoveCat) {
                    setAction(ActionState.place)
                    game.nextPlayer();
                } else {
                    setAction(ActionState.pending);
                }
            }
            setGridState(prevGridState => {
              const newGridState = prevGridState.map(row => row.slice());
  
              newGridState[rowIndex][columnIndex] = cellState.square;
              return newGridState;
            });
        } else {
          setGridState(prevGridState => {
            const newGridState = prevGridState.map(row => row.slice());

            newGridState[rowIndex][columnIndex] = cellState.square;
            return newGridState;
          });
        }
        setSelectedButton({row:0,column:0});
        setGridState(prevGridState => {
          const newGridState = prevGridState.map(row => row.slice());

          newGridState[rowIndex][columnIndex] = cellState.square;
          return newGridState;
        });
    }

    const ageCatButton = () => {
        setAction(ActionState.age);
        setSelectionIndex(0);
        const cats = ageCats[0];
        setGridState(prevGridState => {
            const newGridState = prevGridState.map(row => row.slice());
            const rowDelta = cats.direction == Direction.E ? 0 : 1;
            const colDelta = cats.direction == Direction.E  || cats.direction == Direction.SE ? 1 : cats.direction == Direction.S ? 0: cats.direction == Direction.SW ? -1: 0;
            for(let i = 0; i < 3; i++) {
                newGridState[cats.row+(i*rowDelta)][cats.col+(i*colDelta)] = cellState.age;
            }
            
            return newGridState;
          });
    }

    const ageCatAction = () => {
        const cats = ageCats[selectionIndex];
        setGridState(prevGridState => {
            const newGridState = prevGridState.map(row => row.slice());
            const rowDelta = cats.direction == Direction.E ? 0 : 1;
            const colDelta = cats.direction == Direction.E  || cats.direction == Direction.SE ? 1 : cats.direction == Direction.S ? 0: cats.direction == Direction.SW ? -1: 0;
            for(let i = 0; i < 3; i++) {
                game.ageCat(cats.row+(i*rowDelta), cats.col+(i*colDelta));
                newGridState[cats.row+(i*rowDelta)][cats.col+(i*colDelta)] = cellState.square;
            }
            
            return newGridState;
          });
        setAgeCats(Array(0));
        setSelectionIndex(0);
        game.nextPlayer();
    }

    const removeCatButton = () => {
        setAction(ActionState.remove);
        const currentPlayer = game.getCurPlayer();
        const catArray = Array(0);
        for(let row = 0; row < game.getGrid().length; row++)
        {
            for(let column = 0; column < game.getGrid()[0].length; column++)
            {
                if(game.getGrid()[row][column]?.owner == currentPlayer){
                    catArray.push({row, column});
                }
            }
        }
        setGridState(prevGridState => {
            const newGridState = prevGridState.map(row => row.slice());

            catArray.forEach((cat)=> {
                newGridState[cat.row][cat.column] = cellState.remove;
            });
            
            return newGridState;
          });
    }
    const removeCatAction = (row:number, column:number) => {
        game.removeCat(row, column);
        setGridState(prevGridState => {
            const newGridState = prevGridState.map(row => row.slice());
            for(let row = 0; row < game.getGrid().length; row++)
                {
                    for(let column = 0; column < game.getGrid()[0].length; column++)
                    {
                        if(prevGridState[row][column] == cellState.remove){
                            prevGridState[row][column] = cellState.square;
                        }
                    }
                }
            return newGridState;
          });
          setAction(ActionState.place);
          setRemoveCat(false);
          game.nextPlayer();
    }

    return (
            <div>
                <p>
                {removeCat ? 
                    <button data-testid="removebutton" onClick={removeCatButton}>Remove Cat</button> : false
                }
                </p>
                {
                <AgeSelection
                    actionState={action}
                    ageCatsArray={ageCats}
                    ageCatButton={ageCatButton}
                    nextAgeGroup={nextAgeGroup}
                    ageCatAction={ageCatAction}>
                </AgeSelection>
                }
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img className="player-cat" height={50} width={50} src='/BlackAdultCat.png' alt="Black Adult Cat"/>
                    <span data-testid="p0-cat-count" style={{ margin: '0 10px' }}>{game.getPlayer(0).felines.cats}</span>
                    <img className='player-cat' height={50} width={50} src='/BlackKitten.png'  alt="Black Kitten"/>
                    <span data-testid="p0-kitten-count" style={{ margin: '0 10px' }}>{game.getPlayer(0).felines.kittens}</span>
                </div>
                <span className="active-player" data-testid="active-player">Player:{game.getCurPlayer()}</span>
                <div className="game-container">
                    <div className="main-container">
                        <div className="grid-container">
                            {[...Array(6)].map((_, rowIndex) => (
                            <div key={rowIndex} className="grid-row">
                                {[...Array(6)].map((cell, colIndex) => (
                                <Cell 
                                    testid={`${rowIndex}-${colIndex}`}
                                    state={gridState[rowIndex][colIndex]}
                                    game={game}
                                    OnClose={(rowIndex, colIndex) => {closeCellMenu(rowIndex, colIndex)}}
                                    PlaceFeline={placeFeline}
                                    row={rowIndex}
                                    column={colIndex}
                                    OpenCellMenu={(rowIndex, colIndex) => {openCellMenu(rowIndex, colIndex)}}
                                    RemoveCatAction={(rowIndex, colIndex) => {removeCatAction(rowIndex, colIndex)}}>
                                </Cell>
                                ))}
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <WonWindow/>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img className="player-cat" height={50} width={50} src="/CalicoAdultCat.png" alt="Calico Adult Cat"/>
                    <span data-testid="p1-cat-count" style={{ margin: '0 10px' }}>{game.getPlayer(1).felines.cats}</span>
                    <img className="player-cat" height={50} width={50} src='/CalicoKitten.png' alt="Calico Kitten"/>
                    <span data-testid="p1-kitten-count" style={{ margin: '0 10px' }}>{game.getPlayer(1).felines.kittens}</span>
                </div>
                <div>
                    <Restart
                        text="Restart"
                    />
                </div>
            </div>
        
    );
};

export default ReactBoopGame
const container = document.getElementById('root') || new Document();
const root = createRoot(container);

root.render(<ReactBoopGame/>);