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
}