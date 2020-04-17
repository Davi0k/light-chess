import { Validator, Chessboard, Validations, Pieces, Coordinate, Colors, Movement } from "../src/validator";
import { Chess } from "../src/chess";

describe("The Validator namespace should", function() {
    const check: Chessboard = [
        [ Pieces.White.Rook, Pieces.White.Knight, Pieces.White.Bishop, Pieces.White.Queen, Pieces.White.King, Pieces.White.Bishop, Pieces.White.Knight, Pieces.White.Rook ],
        [ Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.White.Pawn, Pieces.Empty, Pieces.Empty, Pieces.White.Pawn ],
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.White.Pawn, Pieces.Empty, Pieces.Empty ],
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.White.Pawn, Pieces.Black.Queen ], 
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Black.Pawn, Pieces.Empty, Pieces.Empty, Pieces.Empty ], 
        [ Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty ], 
        [ Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Empty, Pieces.Black.Pawn, Pieces.Black.Pawn, Pieces.Black.Pawn ],
        [ Pieces.Black.Rook, Pieces.Black.Knight, Pieces.Black.Bishop, Pieces.Empty, Pieces.Black.King, Pieces.Black.Bishop, Pieces.Black.Knight, Pieces.Black.Rook ],
    ];

    describe("be able to validate", function() {
        let validation: Validations | null = null;

        it("a legal move", function() {
            validation = Validator.validate(Chess.layout, {
                initial: { row: 1, column: 4 }, 
                final: { row: 3, column: 4 }
            });

            expect(validation).toBe(Validations.LEGAL_MOVE);
        });

        it("an illegal move", function() {
            validation = Validator.validate(Chess.layout, {
                initial: { row: 0, column: 4 },
                final: { row: 1, column: 4 }
            });

            expect(validation).toBe(Validations.ILLEGAL_MOVE);
        });

        it("an out of board move", function() {
            validation = Validator.validate(Chess.layout, {
                initial: { row: 10, column: 10 },
                final: { row: 15, column: 15 }
            });

            expect(validation).toBe(Validations.OUT_OF_BOARD);
        });

        it("a blank square move", function() {
            validation = Validator.validate(Chess.layout, {
                initial: { row: 5, column: 5 },
                final: { row: 2, column: 2 }
            });

            expect(validation).toBe(Validations.BLANK_SQUARE);
        });

        it("a king on check move", function() {
            validation = Validator.validate(check, {
                initial: { row: 1, column: 4 }, 
                final: { row: 3, column: 4 }
            });

            expect(validation).toBe(Validations.KING_ON_CHECK);
        });
    });

    describe("be able to calculate every legal move for a piece", function() {
        let coordinate: Coordinate | null = null;
        
        let legals: Coordinate[] = new Array();

        it("within a standard chessboard", function() {
            coordinate = { row: 0, column: 1 };

            legals = Validator.legals(Chess.layout, coordinate);

            expect(legals.length).toBe(2);
        });

        it("within an on check chessboard", function() {
            coordinate = { row: 0, column: 1 };

            legals = Validator.legals(check, coordinate);

            expect(legals.length).toBe(0);
        });
    });

    describe("be able to calculate every possible move for a player", function() {
        let possibilities: Movement[] = new Array();

        it("within a standard chessboard", function() {
            possibilities = Validator.possibilities(Chess.layout, Colors.WHITE);

            expect(possibilities.length).toBe(20);
        });

        it("within an on check chessboard", function() {
            possibilities = Validator.possibilities(check, Colors.WHITE);

            expect(possibilities.length).toBe(0);
        });
    });

    describe("be able to find if a player is on check", function() {
        let result: boolean | null = null;

        it("within a standard chessboard", function() {
            result = Validator.check(Chess.layout, Colors.WHITE);

            expect(result).toBe(false);
        });

        it("within an on check chessboard", function() {
            result = Validator.check(check, Colors.WHITE);

            expect(result).toBe(true);
        });
    });
});