import { Colors, Validations, Pieces, Validator, Chessboard, Movement, Coordinate } from "./validator";

export class Chess {
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

    public chessboard: Chessboard;

    public turn: Colors = Colors.WHITE;

    public checkmate: Colors = null;

    constructor(chessboard: Chessboard = Chess.layout) {
        this.chessboard = chessboard;
    }

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

    public validate = (movement: Movement): Validations => 
        Validator.validate(this.chessboard, movement);
    
    public legals = (coordinate: Coordinate): Coordinate[] => 
        Validator.legals(this.chessboard, coordinate);

    public possibilities = (color: Colors = this.turn): Movement[] => 
        Validator.possibilities(this.chessboard, color);

    public check = (color: Colors = this.turn): boolean => 
        Validator.check(this.chessboard, color);

    public static decode(square: string): Coordinate | null {
        const letters: string[] = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
        const numbers: string[] = [ "1", "2", "3", "4", "5", "6", "7", "8" ];

        if(square.length > 2) return null;

        const X: string = square[0], Y: string = square[1];

        if(letters.indexOf(X) < 0 || numbers.indexOf(Y) < 0) return null;

        const coordinate: Coordinate = {
            row: numbers.indexOf(Y),
            column: letters.indexOf(X)
        };

        return coordinate;
    }

    public static ascii(chessboard: Chessboard): string {
        const emoji = function(piece) {
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