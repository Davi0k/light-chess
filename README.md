# light-chess
`light-chess` is a light-weight, simple and fast NodeJS library to handle chess matches and chess moves validation. The library has been written in `Type-Script` and well documented using `TSDoc` standard.

## Installation using `NPM`
You can install `light-chess` using the infamous package manager `NPM`.
To do so, just type this in your workspace:
```
npm install light-chess
```
### Extra installation for `Type-Script` users
If you are using Type-Script you may want to install the related @types.
Just run this command:
```
npm install @types/light-chess
```

## A simple example program developed using `light-chess`
```typescript
import { Chess, Coordinate, Movement, Validations } from "light-chess";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const chess: Chess = new Chess();

rl.on("line", function(data: string) {
    const first: string = data.split(" ")[0], second: string = data.split(" ")[1];

    const initial: Coordinate = Chess.decode(first), final: Coordinate = Chess.decode(second);

    if(initial == null || final == null || data.split(" ").length > 2) {
        console.log("The inserted coordinate is not valid, try again...\n");
        return;
    }

    const movement: Movement = { initial, final };

    const validation: Validations = chess.move(movement);

    switch(validation) {
        case Validations.BLANK_SQUARE:
        case Validations.ILLEGAL_MOVE:
            console.log("Illegal or invalid move for the selected piece\n");
            break;

        case Validations.KING_ON_CHECK:
            console.log("Your king is under attack, this move is illegal\n");
            break;

        case Validations.CHECKMATE:
            console.log(`Checkmate! ${chess.checkmate ? "BLACK" : "WHITE"} wins the match\n`);
            process.exit();
    }

    console.log(`Current turn: ${chess.turn ? "BLACK" : "WHITE"}`);

    const ascii: string = chess.ascii();

    console.log(ascii + "\n");

    console.log("Insert a valid move: (example: e2 e4)");
});

console.log(`Current turn: ${chess.turn ? "BLACK" : "WHITE"}`);

const ascii: string = chess.ascii();

console.log(ascii + "\n");

console.log("Insert a valid move: (example: e2 e4)");
```