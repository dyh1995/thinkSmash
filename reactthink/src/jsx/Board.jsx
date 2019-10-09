
import React from 'react';//创建组件，虚拟DOM元素，必须这么写

//棋子
function Square(props) {
    return (
        <button className={props.isHeightLight ? 'square hight_light' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// 棋盘类
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                isHeightLight={this.props.winnerData.indexOf(i) !== -1}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let boardInit = [0,1,2];
        const board = boardInit.map((_step, move) => {
            return (
                <div className="board-row" key={move}>
                    {this.renderSquare(move*3)}
                    {this.renderSquare(move*3+1)}
                    {this.renderSquare(move*3+2)}
                </div>
            );
        });
        return (
            <div>
                {board}
            </div>
        );
    }
}

export default Board;