const game = new Chess();

let board = null;

function onDragStart(source, piece) {

    if (game.game_over()) {
        return false;
    }

    if (
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)
    ) {
        return false;
    }
}

function onDrop(source, target) {

    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) {
        return 'snapback';
    }

    updateStatus();
}

function onSnapEnd() {
    board.position(game.fen());
}

board = Chessboard('board', {
    draggable: true,
    position: 'start',
    pieceTheme:
        'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});

function updateStatus() {

    let status = '';

    if (game.in_checkmate()) {

        status =
            '♚ Checkmate! ' +
            (game.turn() === 'w'
                ? 'Black Wins'
                : 'White Wins');

    }
    else if (game.in_draw()) {

        status = '🤝 Draw';

    }
    else {

        status =
            (game.turn() === 'w'
                ? 'White'
                : 'Black')
            + ' to Move';

        if (game.in_check()) {
            status += ' - CHECK!';
        }
    }

    document.getElementById('status').innerHTML = status;

    updateMoveHistory();
}

function updateMoveHistory() {

    const history = game.history();

    let html = '';

    for (let i = 0; i < history.length; i += 2) {

        html += `<strong>${Math.floor(i/2)+1}.</strong> ${history[i]}`;

        if (history[i + 1]) {
            html += ` ${history[i + 1]}`;
        }

        html += '<br>';
    }

    document.getElementById('history').innerHTML = html;
}

updateStatus();