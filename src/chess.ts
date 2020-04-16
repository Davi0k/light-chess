import { Colors, Validations, Coordinate, Movement, Chessboard, Validator, Square, Pieces } from "./validator";

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
     * @param layout - The layout of the chessboard at the beginning of the match, if ignored the default layout will be `Chess.layout`.
     */
    constructor(layout: Chessboard = Chess.layout) {
        this.chessboard = layout;
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
     * Creates an ASCII string which represents the current chessboard layout.
     * 
     * @returns The created ASCII string.
     * 
     * @remarks 
     * Non-static wrapper for respective `Chess.ascii` static method.
     */
    public ascii = (): string =>
        Chess.ascii(this.chessboard);


    /**
     * Converts a string format coordinate to the respective `Coordinate` object.
     * 
     * @param square - The selected square of the chessboard expressed in string format (example: `e2`, `a5`, `h6`).
     * @returns The respective `Coordinate` object, if the string format is not valid the function will return `null`.
     */
    public static decode(square: string): Coordinate | null {
        const letters: string[] = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
        const numbers: string[] = [ "1", "2", "3", "4", "5", "6", "7", "8" ];

        if(square == null || square.length > 2) return null;

        const X: string = square[0].toUpperCase(), Y: string = square[1];

        if(letters.indexOf(X) < 0 || numbers.indexOf(Y) < 0) return null;

        const coordinate: Coordinate = {
            row: numbers.indexOf(Y),
            column: letters.indexOf(X)
        };

        return coordinate;
    }

    /**
     * Creates an ASCII string which represents the current chessboard layout.
     * 
     * @param chessboard - The chessboard layout to represent.
     * @returns The created ASCII string.
     */
    public static ascii(chessboard: Chessboard): string {
        const emoji = function(piece: Square) {
            switch(piece) {
                case Pieces.White.Pawn: return "♙";
                case Pieces.White.Bishop: return "♗";
                case Pieces.White.Knight: return "♘";
                case Pieces.White.Rook: return "♖";
                case Pieces.White.Queen: return "♕";
                case Pieces.White.King: return "♔";

                case Pieces.Black.Pawn: return "♟";
                case Pieces.Black.Bishop: return "♝";
                case Pieces.Black.Knight: return "♞";
                case Pieces.Black.Rook: return "♜";
                case Pieces.Black.Queen: return "♛";
                case Pieces.Black.King: return "♚";

                case Pieces.Empty: return " ";
            }
        };

        let ascii: string = "";

        for(let row = chessboard.length - 1; row >= 0; row--) {
            let append: string = (row + 1) + " |";

            for(const column in chessboard[row]) 
                append = append + emoji(chessboard[row][column]) + " |";

            ascii = ascii + append + "\n";
        }

        ascii = ascii + ("   A  B  C  D  E  F  G  H");
    
        return ascii;
    }
}