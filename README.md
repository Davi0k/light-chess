# LIGHT-CHESS By Davi0k

`light-chess` is a light-weight, simple and fast NodeJS library to handle chess matches and chess moves validation. The library has been written in `Type-Script` and well documented using `TSDoc` standard.

### Package reference and documentation

You can find the package documentation inside the `/docs`.
This folder contains all the files generated by `Typedoc`, just open the` index.html` file and you will be able to explore the documentation as you wish.

## Installing the package using `NPM`

You can install `light-chess` using the famous package manager `NPM`.
To do so, just type this in your workspace:
```
npm install light-chess
```
Now you can import the entire package using `commonjs`:
```javascript
const light = require("light-chess");
```
In `Type-Script`, you should do:
```typescript
import light from "light-chess";
```

### A note for `Type-Script` users

If you are using `Type-Script` you may want to install the related `@types`.
This step is not required, being `light-chess` developed entirely in `Type-Script`, the related `@types` are automatically installed.

## Building the package from source-code

First, clone this repository using `git`:
```
git clone https://github.com/Davi0k/light-chess.git
cd light-chess
```
Then install all the required packages using `npm`:
```
npm install
```
Finally, compile the `/src` directory using the `Type-Script Compiler`:
```
npm run compile
```

## Testing the package
The tests of the project has been written using the `Jasmine` test-suite.
If you want to run them and check the test result, simply run this command:
```
npm test
```

## Using FEN expressions with `light-chess`

`light-chess` supports the import and export of matches in FEN format as well.
To import or export a FEN expression, you have to use the apposite method inside the `Chess` class.
 
### Importing a FEN expression in a match
To do this, you just have to use the `Chess.import` method:

```typescript
const chess: Chess = new Chess();

chess.import("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0");

const chessboard: string = chess.ascii();

console.log(chessboard);
```

Or you can import the expression directly in the class `constructor`:

```typescript
const chess: Chess = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0");

const chessboard: string = chess.ascii();

console.log(chessboard);
```

### Exporting a match into a FEN expression
To do this, you just have to use the `Chess.export` method:

```typescript
const chess: Chess = new Chess();

const fen: string = chess.export();

console.log(fen);
```

## A minimal chess game written in `Type-Script` with `light-chess`
```typescript
import { Chess, Coordinate, Movement, Validations } from "light-chess";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const chess: Chess = new Chess();

function print(chess: Chess): void {
    console.log(`Current turn: ${chess.turn ? "BLACK" : "WHITE"}`);

    const unicode: string = chess.unicode();

    console.log(unicode + "\n");

    console.log("Insert a valid move: (example: e2 e4)");
}

rl.on("line", function(data: string) {
    const coordinates: [string, string] = data.split(" ") as [string, string];

    const initial: Coordinate = Chess.decode(coordinates[0]), final: Coordinate = Chess.decode(coordinates[1]);

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

    print(chess);
});

print(chess);
```

## License

This project is released under the `GNU General Public License v3.0`.
You can find the complete license here: [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)