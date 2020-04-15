import { } from "./chess";

class Square {
    public color: Colors; public validation: Function | null;
  
    constructor(color: Colors, validation: Function | null) {
        this.color = color;
        this.validation = validation;
    }
}

export enum Colors {
    WHITE,
    BLACK,
    EMPTY
}

export enum Validations {
    LEGAL_MOVE, ILLEGAL_MOVE,
    KING_ON_CHECK,
    CHECKMATE,
    BLANK_SQUARE
}

export type Coordinate = { row: number, column: number };

export type Movement = { initial: Coordinate, final: Coordinate };

export type Chessboard = Array<Square[]>;

export namespace Validator {
    export function validate(chessboard: Chessboard, movement: Movement): Validations {
        const square: Square = chessboard[movement.initial.row][movement.initial.column];

        if(square == Pieces.Empty) return Validations.BLANK_SQUARE;

        const moves: Coordinate[] = square.validation(chessboard, movement.initial);

        console.log(moves);

        let index: number = 0;
        
        for(const move in moves) if(moves[move] == movement.final) index = +move;

        if(index < 0) return Validations.ILLEGAL_MOVE;

        return Validations.LEGAL_MOVE;
    }

    export function legals(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const square: Square = chessboard[coordinate.row][coordinate.column];

        const coordinates: Coordinate[] = square.validation(chessboard, coordinate);

        return coordinates;
    }

    export function possibilities(chessboard: Chessboard, color: Colors): Movement[] {
        const movements: Movement[] = new Array<Movement>();

        for(const row in chessboard)
            for(const column in chessboard[row]) 
                if(chessboard[row][column].color == color) {
                    const coordinate: Coordinate = { 
                        row: +row, 
                        column: +column 
                    };

                    const moves = chessboard[row][column].validation(chessboard, coordinate);

                    for(const move of moves) 
                        movements.push({ 
                            initial: coordinate, 
                            final: move 
                        });
                }

        return movements;
    }
}

namespace Evaluates {
    export function pawn(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = +coordinate.row, column: number = +coordinate.column;
        const addictive: number = chessboard[row][column].color ? Additives.NEGATIVE : Additives.POSITIVE;

        if(chessboard[row + addictive]?.[column] == Pieces.Empty) 
            coordinates.push({ row: row + addictive, column: column });

        const eat: Colors = chessboard[row][column].color ? Colors.WHITE : Colors.BLACK;

        if(chessboard[row + addictive]?.[column + 1]?.color == eat) 
            coordinates.push({ row: row + addictive, column: column + 1 });
        
        if(chessboard[row + addictive]?.[column - 1]?.color == eat) 
            coordinates.push({ row: row + addictive, column: column - 1 });

        if(row == chessboard[row][column].color ? chessboard.length - 2 : 1)
            if(chessboard[row + addictive]?.[column] == Pieces.Empty)
                if(chessboard[row + addictive + addictive]?.[column] == Pieces.Empty) 
                    coordinates.push({ row: row + addictive + addictive, column: column });

        return coordinates;
    }

    export function bishop(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.POSITIVE, column: Additives.POSITIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.POSITIVE, column: Additives.NEGATIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEGATIVE, column: Additives.POSITIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEGATIVE, column: Additives.NEGATIVE }));

        return coordinates;
    }

    export function knight(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = +coordinate.row, column: number = +coordinate.column;
        const eat: Colors = chessboard[row][column].color ? Colors.WHITE : Colors.BLACK;

        if(chessboard[row + 2]?.[column - 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 2, column: column - 1 });
        if(chessboard[row + 2]?.[column + 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 2, column: column + 1 });
        if(chessboard[row - 2]?.[column + 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 2, column: column + 1 });
        if(chessboard[row - 2]?.[column - 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 2, column: column - 1 });

        if(chessboard[row + 1]?.[column - 2]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column - 2 });
        if(chessboard[row + 1]?.[column + 2]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column + 2 });
        if(chessboard[row - 1]?.[column + 2]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column + 2 });
        if(chessboard[row - 1]?.[column - 2]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column - 2 });

        return coordinates;
    }

    export function rook(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        
        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.POSITIVE, column: Additives.NEUTRAL }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEUTRAL, column: Additives.POSITIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEGATIVE, column: Additives.NEUTRAL }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEUTRAL, column: Additives.NEGATIVE }));

        return coordinates;
    }

    export function queen(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();

        const bishop = Evaluates.bishop(chessboard, coordinate), rook = Evaluates.rook(chessboard, coordinate);

        coordinates.push(...bishop); coordinates.push(...rook);

        return coordinates;
    }

    export function king(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = +coordinate.row, column: number = +coordinate.column;
        const eat: Colors = chessboard[row][column].color ? Colors.WHITE : Colors.BLACK;

        if(chessboard[row + 1]?.[column]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column });
        if(chessboard[row - 1]?.[column]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column });
        if(chessboard[row]?.[column + 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row, column: column + 1 });
        if(chessboard[row]?.[column - 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row, column: column - 1 });

        if(chessboard[row + 1]?.[column - 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column - 1 });
        if(chessboard[row + 1]?.[column + 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column + 1 });
        if(chessboard[row - 1]?.[column + 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column + 1 });
        if(chessboard[row - 1]?.[column - 1]?.color == Colors.EMPTY || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column - 1 });

        return coordinates;
    }

    enum Additives {
        NEGATIVE = -1,
        NEUTRAL = 0,
        POSITIVE = 1
    } 

    export function linear(chessboard: Chessboard, coordinate: Coordinate, additive: { row: Additives, column: Additives }): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = +coordinate.row, column: number = +coordinate.column;

        let maximum: number = chessboard.length * Math.abs(additive.row); 
        
        if(maximum == 0) maximum = chessboard[row].length * Math.abs(additive.column);

        for(let i = 1; i < maximum; i++) {
            if(chessboard[row + i * additive.row]?.[column + i * additive.column] == undefined) break;

            const square = chessboard[row + i * additive.row][column + i * additive.column];

            if(square.color == chessboard[row][column].color) break;

            coordinates.push({ row: row + i * additive.row, column: column + i * additive.column });

            if(square == Pieces.Empty) continue;

            break;
        } 

        return coordinates;
    }
}

export const Pieces = {
    White: {
        Pawn: new Square(Colors.WHITE, Evaluates.pawn),
        Bishop: new Square(Colors.WHITE, Evaluates.bishop),
        Knight: new Square(Colors.WHITE, Evaluates.knight),
        Rook: new Square(Colors.WHITE, Evaluates.rook),
        Queen: new Square(Colors.WHITE, Evaluates.queen),
        King: new Square(Colors.WHITE, Evaluates.king),
    },
    Black: {
        Pawn: new Square(Colors.BLACK, Evaluates.pawn),
        Bishop: new Square(Colors.BLACK, Evaluates.bishop),
        Knight: new Square(Colors.BLACK, Evaluates.knight),
        Rook: new Square(Colors.BLACK, Evaluates.rook),
        Queen: new Square(Colors.BLACK, Evaluates.queen),
        King: new Square(Colors.BLACK, Evaluates.king),
    },
    Empty: new Square(Colors.EMPTY, null)
};