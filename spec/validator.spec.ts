import { Validator, Chessboard, Validations, Pieces, Coordinate, Colors, Movement } from "../src/validator";
import { Chess } from "../src/chess";

describe("The Validator namespace should", function() {
    const chessboard: Chessboard = Chess.layout;

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
        it("a legal move", function() {
            const validation: Validations = Validator.validate(chessboard, {
                initial: { row: 1, column: 4 }, 
                final: { row: 3, column: 4 }
            });

            expect(validation).toBe(Validations.LEGAL_MOVE);
        })

        it("an illegal move", function() {
            const validation: Validations = Validator.validate(chessboard, {
                initial: { row: 0, column: 4 },
                final: { row: 1, column: 4 }
            });

            expect(validation).toBe(Validations.ILLEGAL_MOVE);
        })

        it("an out of board move", function() {
            const validation: Validations = Validator.validate(chessboard, {
                initial: { row: 10, column: 10 },
                final: { row: 15, column: 15 }
            });

            expect(validation).toBe(Validations.OUT_OF_BOARD);
        })

        it("a blank square move", function() {
            const validation: Validations = Validator.validate(chessboard, {
                initial: { row: 5, column: 5 },
                final: { row: 2, column: 2 }
            });

            expect(validation).toBe(Validations.BLANK_SQUARE);
        })

        it("a king on check move", function() {
            const validation: Validations = Validator.validate(check, {
                initial: { row: 1, column: 4 }, 
                final: { row: 3, column: 4 }
            });

            expect(validation).toBe(Validations.KING_ON_CHECK);
        })
    })

    describe("be able to calculate every legal move for a piece", function() {
        it("within a standard chessboard", function() {
            const coordinate: Coordinate = { row: 0, column: 1 };

            const legals: Coordinate[] = Validator.legals(chessboard, coordinate);

            expect(legals.length).toBe(2);
        })

        it("within an on check chessboard", function() {
            const coordinate: Coordinate = { row: 0, column: 1 };

            const legals: Coordinate[] = Validator.legals(check, coordinate);

            expect(legals.length).toBe(0);
        })
    })

    describe("be able to calculate every possible move for a player", function() {
        it("within a standard chessboard", function() {
            const posibilities: Movement[] = Validator.possibilities(chessboard, Colors.WHITE);

            expect(posibilities.length).toBe(20);
        })

        it("within an on check chessboard", function() {
            const posibilities: Movement[] = Validator.possibilities(check, Colors.WHITE);

            expect(posibilities.length).toBe(0);
        })
    })

    describe("be able to find if a player is on check", function() {
        it("within a standard chessboard", function() {
            const result: boolean = Validator.check(chessboard, Colors.WHITE);

            expect(result).toBe(false);
        })

        it("within an on check chessboard", function() {
            const result: boolean = Validator.check(check, Colors.WHITE);

            expect(result).toBe(true);
        })
    })
})