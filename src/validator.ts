export enum Colors {
    WHITE,
    BLACK
}

export enum Validations {
    LEGAL_MOVE, ILLEGAL_MOVE,
    KING_ON_CHECK,
    CHECKMATE,
    BLANK_SQUARE, OUT_OF_BOARD,
    MATCH_FINISHED
}

export type Coordinate = { row: number, column: number };

export type Movement = { initial: Coordinate, final: Coordinate };

export type Chessboard = [
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
    [Square, Square, Square, Square, Square, Square, Square, Square],
];

export namespace Validator {
    export function validate(chessboard: Chessboard, movement: Movement): Validations {
        const square: Square = chessboard[movement.initial.row]?.[movement.initial.column];

        if(square == null) return Validations.OUT_OF_BOARD;

        if(square == Pieces.Empty) return Validations.BLANK_SQUARE;

        const moves: Coordinate[] = square.validation(chessboard, movement.initial, false);

        const filters: Coordinate[] = Evaluates.filter(chessboard, movement.initial, moves);

        for(const filter of filters) if(filter.row == movement.final.row && filter.column == movement.final.column) return Validations.LEGAL_MOVE;

        for(const move of moves) if(move.row == movement.final.row && move.column == movement.final.column) return Validations.KING_ON_CHECK;

        return Validations.ILLEGAL_MOVE;
    }

    export function legals(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const square: Square = chessboard[coordinate.row]?.[coordinate.column];

        const coordinates: Coordinate[] = square?.validation?.(chessboard, coordinate, true) || new Array<Coordinate>();

        return coordinates;
    }

    export function possibilities(chessboard: Chessboard, color: Colors, check: boolean = true): Movement[] {
        const movements: Movement[] = new Array<Movement>();

        for(const row in chessboard)
            for(const column in chessboard[row]) {
                if(chessboard[row][column].color != color) continue;

                const initial: Coordinate = { row: +row, column: +column };

                const finals = chessboard[row][column].validation(chessboard, initial, check);

                for(const final of finals) 
                    movements.push({ initial, final });
            }

        return movements;
    }

    export function check(chessboard: Chessboard, color: Colors): boolean {
        const piece: Square = color ? Pieces.Black.King : Pieces.White.King;
        let king: Coordinate = null;

        for(const row in chessboard)
            for(const column in chessboard[row])
                if(chessboard[row][column] == piece) 
                    king = { row: +row, column: +column };

        const possibilities: Movement[] = Validator.possibilities(chessboard, color ? Colors.WHITE : Colors.BLACK, false);

        for(const possibility of possibilities)
            if(possibility.final.row == king.row && possibility.final.column == king.column)
                return true;

        return false;
    }
}

enum Additives {
    NEGATIVE = -1,
    NEUTRAL = 0,
    POSITIVE = 1
} 

namespace Evaluates {
    export function pawn(chessboard: Chessboard, coordinate: Coordinate, check: boolean): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = coordinate.row, column: number = coordinate.column;
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

        return check ? Evaluates.filter(chessboard, coordinate, coordinates) : coordinates;
    }

    export function bishop(chessboard: Chessboard, coordinate: Coordinate, check: boolean): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.POSITIVE, column: Additives.POSITIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.POSITIVE, column: Additives.NEGATIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEGATIVE, column: Additives.POSITIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEGATIVE, column: Additives.NEGATIVE }));

        return check ? Evaluates.filter(chessboard, coordinate, coordinates) : coordinates;
    }

    export function knight(chessboard: Chessboard, coordinate: Coordinate, check: boolean): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = coordinate.row, column: number = coordinate.column;
        const eat: Colors = chessboard[row][column].color ? Colors.WHITE : Colors.BLACK;

        if(chessboard[row + 2]?.[column - 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 2, column: column - 1 });
        if(chessboard[row + 2]?.[column + 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 2, column: column + 1 });
        if(chessboard[row - 2]?.[column + 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 2, column: column + 1 });
        if(chessboard[row - 2]?.[column - 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 2, column: column - 1 });

        if(chessboard[row + 1]?.[column - 2] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column - 2 });
        if(chessboard[row + 1]?.[column + 2] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column + 2 });
        if(chessboard[row - 1]?.[column + 2] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column + 2 });
        if(chessboard[row - 1]?.[column - 2] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column - 2 });

        return check ? Evaluates.filter(chessboard, coordinate, coordinates) : coordinates;
    }

    export function rook(chessboard: Chessboard, coordinate: Coordinate, check: boolean): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        
        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.POSITIVE, column: Additives.NEUTRAL }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEUTRAL, column: Additives.POSITIVE }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEGATIVE, column: Additives.NEUTRAL }));

        coordinates.push(...Evaluates.linear(chessboard, coordinate, { row: Additives.NEUTRAL, column: Additives.NEGATIVE }));

        return check ? Evaluates.filter(chessboard, coordinate, coordinates) : coordinates;
    }

    export function queen(chessboard: Chessboard, coordinate: Coordinate, check: boolean): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();

        const bishop = Evaluates.bishop(chessboard, coordinate, check), rook = Evaluates.rook(chessboard, coordinate, check);

        coordinates.push(...bishop); coordinates.push(...rook);

        return check ? Evaluates.filter(chessboard, coordinate, coordinates) : coordinates;
    }

    export function king(chessboard: Chessboard, coordinate: Coordinate, check: boolean): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = coordinate.row, column: number = coordinate.column;
        const eat: Colors = chessboard[row][column].color ? Colors.WHITE : Colors.BLACK;

        if(chessboard[row + 1]?.[column] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column });
        if(chessboard[row - 1]?.[column] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column });
        if(chessboard[row]?.[column + 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row, column: column + 1 });
        if(chessboard[row]?.[column - 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row, column: column - 1 });

        if(chessboard[row + 1]?.[column - 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column - 1 });
        if(chessboard[row + 1]?.[column + 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row + 1, column: column + 1 });
        if(chessboard[row - 1]?.[column + 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column + 1 });
        if(chessboard[row - 1]?.[column - 1] == Pieces.Empty || chessboard[row + 2]?.[column - 1]?.color == eat) coordinates.push({ row: row - 1, column: column - 1 });

        return check ? Evaluates.filter(chessboard, coordinate, coordinates) : coordinates;
    }

    export function filter(chessboard: Chessboard, coordinate: Coordinate, possibilities: Coordinate[]): Coordinate[] {
        const filtered: Coordinate[] = new Array<Coordinate>();

        for(const possibility of possibilities) {
            const temp: Chessboard = chessboard.map(row => row.slice()) as Chessboard;

            temp[possibility.row][possibility.column] = temp[coordinate.row][coordinate.column];

            temp[coordinate.row][coordinate.column] = Pieces.Empty;

            const check: boolean = Validator.check(temp, chessboard[coordinate.row][coordinate.column].color); 

            if(check == false) filtered.push(possibility);
        }

        return filtered;
    }

    export function linear(chessboard: Chessboard, coordinate: Coordinate, additive: { row: Additives, column: Additives }): Coordinate[] {
        const coordinates: Coordinate[] = new Array<Coordinate>();
        const row: number = coordinate.row, column: number = coordinate.column;

        for(let i = 1; i < chessboard.length; i++) {
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

export class Square {
    public color: Colors | null; public validation: Function | null;
  
    constructor(
      color: Colors | null = null, 
      validation: Function | null = null) {
        this.color = color;
        this.validation = validation;
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
    Empty: new Square()
};