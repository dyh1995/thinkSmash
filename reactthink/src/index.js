import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './jsx/Board';
let winnerData = Array(3).fill(null);
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                    squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(this.calculateWinner(squares) || squares[i]){
            return false;
            //当有玩家胜出时，或者某个 Square 已经被填充时，该函数不做任何处理直接返回。
        }

        //我们调用了 .slice() 方法创建了 squares 数组的一个副本，而不是直接在现有的数组上进行修改
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((_step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move} className={move === this.state.stepNumber ? 'cur' : ''}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner is ' + winner;
        }else{
            if(this.state.stepNumber === 9){
                status = '平局';
            }else{
                status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerData={winnerData}
                    />
                </div>

                {/* 历史步骤记录 */}
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winnerData = [a, b, c];
            return squares[a];
          }
        }

        return null;
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);