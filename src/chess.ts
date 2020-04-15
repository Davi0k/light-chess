import { Colors, Validations, Pieces, Validator, Chessboard, Movement } from "./validator";

export class Chess {
    public static layout: Chessboard = [
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

    private finish: boolean = false;

    constructor(chessboard: Chessboard = Chess.layout) {
        this.chessboard = chessboard;
    }

    public move(movement: Movement) {

    }
}