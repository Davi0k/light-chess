/**
 * Enumerator which represents the two possible piece color in chess.
 */
export enum Colors {
    WHITE,
    BLACK
}

/**
 * Enumerator which represents one of the possible result given by the `Validator.validate` function.
 * Each value of the enumeration indicates the state occured.
 * 
 * @param LEGAL_MOVE - The move is legal.
 * @param ILLEGAL_MOVE - The move is illegal for the selected piece move pattern.
 * @param KING_ON_CHECK - The king of the player who tried to validate the move is on check.
 * @param BLANK_SQUARE - The selected square is empty and does not contain any piece to move.
 * @param OUT_OF_BOARD - The selected square is out of the board.
 * @param CHECKMATE - The executed move checkmated the opponent.
 * @param MATCH_FINISHED - The move cannot be executed because the match is finished.
 */
export enum Validations {
    LEGAL_MOVE, ILLEGAL_MOVE,
    KING_ON_CHECK,
    BLANK_SQUARE, OUT_OF_BOARD,
    CHECKMATE,
    MATCH_FINISHED
}

/**
 * Type-Alias which represents a coordinate which points to one of the chessboard's square.
 */
export type Coordinate = { row: number, column: number };

/**
 * Type-Alias which represents a movement.
 */
export type Movement = { initial: Coordinate, final: Coordinate };

/**
 * Type-Alias which represents the exact chessboard bone and type.
 */
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

/**
 * Core of the chess-engine, contains useful functions to evaluates moves and matches.
 */
export namespace Validator {
    /**
     * Evaluates and validates a move within the current chessboard.
     * 
     * @param chessboard - The chessboard layout to use.
     * @param movement - The movement to validate.
     * @returns One of the possible value of `Validations` enumeration.
     */
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

    /**
     * Calculates every legal move for a selected piece within the current chessboard.
     * 
     * @param chessboard - The chessboard layout to use.
     * @param coordinate - The coordinate of the piece.
     * @returns An array containing every square's coordinate where the piece can be moved.
     */
    export function legals(chessboard: Chessboard, coordinate: Coordinate): Coordinate[] {
        const square: Square = chessboard[coordinate.row]?.[coordinate.column];

        const coordinates: Coordinate[] = square?.validation?.(chessboard, coordinate, true) || new Array<Coordinate>();

        return coordinates;
    }

    /**
     * Calculates every legal move for a selected player within the current chessboard.
     * 
     * @param chessboard - The chessboard layout to use.
     * @param color - The color of the player to calculate the possible moves. If ignored the default player will be the current turn one.
     * @param check - The default value is true. If it is set to false, all the check control will be disabled.
     * @returns An array containing every possible movement.
     */
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

    /**
     * Evaluates if the selected player is on check.
     * 
     * @param chessboard - The chessboard layout to use.
     * @param color - The color of the player to evaluate. If ignored the default player will be the current turn one.
     * @returns `true`: The player is on check, `false`: The player is not on check.
     */
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

/**
 * Class which represents a chessboard square.
 */
export class Square {
    /**
     * The color of the piece on the square.
     * 
     * @remarks If it is set to `null` then the square will be empty.
     */
    public color: Colors | null; 
    
    /**
     * The validation function of the piece on the square.
     * 
     * @remarks If it is set to `null` then the square will be empty.
     */
    public validation: Function | null;
  
    /**
     * Default class constructor.
     * 
     * @param color - The color of the piece on the square.
     * @param validation - The validation function of the piece on the square.
     */
    constructor(
      color: Colors | null = null, 
      validation: Function | null = null) {
        this.color = color;
        this.validation = validation;
    }
}

/**
 * Wrapper object to represent every possible chess piece, included an empty square.
 */
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