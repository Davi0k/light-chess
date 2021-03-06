import { 
    Colors, 
    Validations, 
    Coordinate,
    Movement, 
    Chessboard, 
    Validator, 
    Square, 
    Pieces, 
    Row 
} from "./validator";

/** 
 * Main class to handle Chess match using light-chess.
 * 
 * @remarks
 * Based on `Validator` namespace and its functions.
 */
export class Chess {
    /**
     * The default layout for the chessboard.
     */
    public static readonly layout: Chessboard = [
        [ Pieces.White.Rook, Pieces.White.Knight, Pieces.White.Bishop, Pieces.White.Queen, Pieces.White.King, Pieces.White.Bishop, Pieces.White.Knight, Pieces.White.Rook ],
        [ Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn ],
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty ],
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty ], 
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty ], 
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty ], 
        [ Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn ],
        [ Pieces.Black.Rook, Pieces.Black.Knight, Pieces.Black.Bishop, Pieces.Black.Queen, Pieces.Black.King, Pieces.Black.Bishop, Pieces.Black.Knight, Pieces.Black.Rook ],
    ];

    /**
     * The current chessboard layout.
     */
    public chessboard: Chessboard;

    /**
     * The current player turn.
     */
    public turn: Colors = Colors.WHITE;

    /**
     * The winner of the match.
     * 
     * @remarks
     * if `null` then the match is not finished.
     */
    public checkmate: Colors | null = null;

    /**
     * Default class constructor.
     * 
     * @param layout - The layout of the chessboard at the beginning of the match, if ignored the default layout will be `Chess.layout`. It can be a Chessboard object or a FEN expression.
     */
    constructor(layout: Chessboard | string = Chess.layout) {
        if(typeof layout == typeof Chess.layout)
            this.chessboard = (layout as Chessboard).map(row => row.slice()) as Chessboard;
        
        if(typeof layout == "string") this.import(layout);
    }

    /**
     * Executes a move for the current player.
     * 
     * @param movement - The movement that will be executed.
     * @returns One of the possible value of `Validations` enumeration.
     */
    public move(movement: Movement): Validations {
        if(this.checkmate) return Validations.MATCH_FINISHED;

        const initial: Coordinate = movement.initial, final: Coordinate = movement.final;

        if(this.chessboard[initial.row][initial.column].color != this.turn) return Validations.ILLEGAL_MOVE;

        const result: Validations = this.validate(movement);

        if(result == Validations.LEGAL_MOVE) {
            this.chessboard[final.row][final.column] = this.chessboard[initial.row][initial.column];

            this.chessboard[initial.row][initial.column] = Pieces.Empty;

            const moves: Movement[] = this.possibilities(this.turn ? Colors.WHITE : Colors.BLACK);

            if(moves.length == 0) {
                this.checkmate = this.turn;

                return Validations.CHECKMATE;
            }

            this.turn = this.turn ? Colors.WHITE : Colors.BLACK;

            return result;
        }

        return result;
    }

    /**
     * Evaluates and validates a move within the current chessboard.
     * 
     * @param movement - The movement to validate.
     * @returns One of the possible value of `Validations` enumeration.
     * 
     * @remarks 
     * Non-static wrapper for respective `Validator.validate` function.
     */
    public validate = (movement: Movement): Validations => 
        Validator.validate(this.chessboard, movement);

    /**
     * Calculates every legal move for a selected piece within the current chessboard.
     * 
     * @param coordinate - The coordinate of the piece.
     * @returns An array containing every square's coordinate where the piece can be moved.
     * 
     * @remarks 
     * Non-static wrapper for respective `Validator.legals` function.
     */
    public legals = (coordinate: Coordinate): Coordinate[] => 
        Validator.legals(this.chessboard, coordinate);

    /**
     * Calculates every legal move for a selected player within the current chessboard.
     * 
     * @param color - The color of the player to calculate the possible moves. If ignored the default player will be the current turn one.
     * @param check - The default value is true. If it is set to false, all the check control will be disabled.
     * @returns An array containing every possible movement.
     * 
     * @remarks 
     * Non-static wrapper for respective `Validator.possibilities` function.
     */
    public possibilities = (color: Colors = this.turn, check: boolean = true): Movement[] => 
        Validator.possibilities(this.chessboard, color, check);

    /**
     * Evaluates if the selected player is on check.
     * 
     * @param color - The color of the player to evaluate. If ignored the default player will be the current turn one.
     * @returns `true`: The player is on check, `false`: The player is not on check.
     * 
     * @remarks 
     * Non-static wrapper for respective `Validator.check` function.
     */
    public check = (color: Colors = this.turn): boolean => 
        Validator.check(this.chessboard, color);

    /**
     * Creates an UTF-16 string which represents the current chessboard layout.
     * 
     * @returns The created UNICODE string.
     * 
     * @remarks 
     * Non-static wrapper for respective `Chess.unicode` static method.
     */
    public unicode = (): string =>
        Chess.unicode(this.chessboard);

    /**
     * Converts a string format coordinate to the respective `Coordinate` object.
     * 
     * @param square - The selected square of the chessboard expressed in string format (example: `e2`, `a5`, `h6`).
     * @throws If the string format coordinate is not valid, the method will throw an Error.
     * @returns The respective `Coordinate` object.
     */
    public static decode(square: string): Coordinate {
        const letters: string[] = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
        const numbers: string[] = [ "1", "2", "3", "4", "5", "6", "7", "8" ];

        const error: Error = new Error("Invalid string format for coordinate, cannot decode it");

        if(square == null || square.length > 2) throw error;

        const X: string = square[0].toUpperCase(), Y: string = square[1];

        if(letters.indexOf(X) < 0 || numbers.indexOf(Y) < 0) throw error;

        const coordinate: Coordinate = {
            row: numbers.indexOf(Y),
            column: letters.indexOf(X)
        };

        return coordinate;
    }

    /**
     * Converts a `Coordinate` object to the respective string format coordinate.
     * 
     * @param square - The selected square of the chessboard expressed using a `Coordinate` object.
     * @throws If the `Coordinate` object contains an invalid row or column, the method will throw an Error.
     * @returns The respective string format coordinate.
     */
    public static encode(square: Coordinate): string {
        const letters: string[] = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
        const numbers: string[] = [ "1", "2", "3", "4", "5", "6", "7", "8" ];

        const letter: string = letters[square.column], number: string = numbers[square.row];

        if(letter == null || number == null) 
            throw new Error("Invalid Coordinate object, the row or the column is not valid, cannot encode it");

        return letter + number;
    }

    /**
     * Imports a FEN expression format replacing the current match.
     * 
     * @param fen - The FEN expression which will be imported (example: `e2`).
     * @throws If the FEN expression is not valid and does not match with the RegExp, the method will throw an Error.
     * 
     * @remarks
     * The RegExp pattern used for FEN validation is: 
     * `\s*^(((?:[rnbqkpRNBQKP1-8]+\/){7})[rnbqkpRNBQKP1-8]+)\s([b|w])\s([K|Q|k|q|-]{1,4})\s(-|[a-h][1-8])\s(\d+\s\d+)$`
     */
    public import(fen: string): void {
        const pattern: RegExp = /\s*^(((?:[rnbqkpRNBQKP1-8]+\/){7})[rnbqkpRNBQKP1-8]+)\s([b|w])\s([K|Q|k|q|-]{1,4})\s(-|[a-h][1-8])\s(\d+\s\d+)$/;

        if(pattern.test(fen) == false) 
            throw new Error("Invalid FEN format string, cannot import it");

        const chessboard: Chessboard = new Array() as Chessboard;

        const representation: string[] = fen.split(" ")[0].split("/").reverse();

        for(const row of representation) {
            const line: Row = new Array() as Row;

            for(const square of row) {
                const empty: number = parseInt(square) || 0;

                if(empty > 0) {
                    for(let i = 0; i < empty; i++)
                        line.push(Pieces.Empty);

                    continue;
                }

                let piece: any = square == square.toUpperCase() ? Pieces.White : Pieces.Black;

                const letter: string = square.toUpperCase();

                switch(letter) {
                    case "P": piece = piece.Pawn; break;
                    case "B": piece = piece.Bishop; break;
                    case "N": piece = piece.Knight; break;
                    case "R": piece = piece.Rook; break;
                    case "Q": piece = piece.Queen; break;
                    case "K": piece = piece.King; break;
                }
                
                line.push(piece);
            }

            chessboard.push(line);
        }

        this.chessboard = chessboard;

        const turn: string = fen.split(" ")[1].toUpperCase();

        if(turn == "W") this.turn = Colors.WHITE;

        if(turn == "B") this.turn = Colors.BLACK;
    }

    /**
     * Exports the current match in FEN expression format.
     * 
     * @returns A string containing the FEN expression.
     */
    public export(): string {
        const representation: string[] = new Array();

        const chessboard: Chessboard = this.chessboard.slice().reverse() as Chessboard;

        const character = function(piece: Square): string {
            const white: string[] = [ "P", "B", "N", "R", "Q", "K" ];
            const black: string[] = [ "p", "b", "n", "r", "q", "k" ];

            return piece.color ? black[piece.type] : white[piece.type];
        }

        for(const row of chessboard) {
            let line: string = ""; 

            let counter: number = 0;

            for(const index in row) {
                const square: Square = row[index];

                if(square == Pieces.Empty) { 
                    counter = counter + 1; 

                    const finish: boolean = parseInt(index) == row.length - 1;

                    if(finish) line = line + counter; continue; 
                }

                if(counter > 0) line = line + counter; counter = 0;

                line = line + character(square);
            }
            
            representation.push(line);
        }

        let fen: string = representation.join("/");

        return fen + (this.turn ? " b " : " w ") + "KQkq - 0 0";
    }

    /**
     * Creates an UTF-16 string which represents the current chessboard layout.
     * 
     * @param chessboard - The chessboard layout to represent.
     * @returns The created UNICODE string.
     */
    public static unicode(chessboard: Chessboard): string {
        const emoji = function(piece: Square): string {
            if(piece == Pieces.Empty) return " ";

            const white: string[] = [ "♙", "♗", "♘", "♖", "♕", "♔" ];
            const black: string[] = [ "♟", "♝", "♞", "♜", "♛", "♚" ];

            return piece.color ? black[piece.type] : white[piece.type];
        };

        let unicode: string = "";

        for(let row = chessboard.length - 1; row >= 0; row--) {
            let append: string = (row + 1) + " |";

            for(const column in chessboard[row]) 
                append = append + emoji(chessboard[row][column]) + " |";

            unicode = unicode + append + "\n";
        }

        unicode = unicode + ("   A  B  C  D  E  F  G  H");
    
        return unicode;
    }
}