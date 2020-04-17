import { Validator, Chessboard, Validations, Pieces, Coordinate, Colors, Movement } from "../src/validator";
import { Chess } from "../src/chess";

describe("The Chess class should", function() {
    describe("be able to decode into a Coordinate object", function() {
        let coordinate: Coordinate | null = null;

        it("a right string format coordinate", function() {
            coordinate = Chess.decode("G4");

            const correct: Coordinate = {
                row: 3,
                column: 6
            };

            expect(coordinate).toEqual(correct);
        });

        it("a wrong string format coordinate", function() {
            expect(function() {
                Chess.decode("Z9");
            }).toThrowError("Invalid string format for coordinate, cannot decode it");
        });
    });

    describe("be able to handle FEN expressions", function() {
        let chess: Chess | null = null;

        const fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0";

        it("and import one into a match", function() {
            chess = new Chess(fen);

            expect(chess.chessboard).toEqual(Chess.layout);

            expect(chess.turn).toBe(Colors.WHITE);
        });

        it("and export a match into one", function() {
            chess = new Chess();

            const result: string = chess.export();

            expect(result).toBe(fen);
        });

        it("and throw an error if the format is invalid", function() {
            chess = new Chess(fen);

            expect(function() {
                chess.import("This is an invalid FEN");
            }).toThrowError("Invalid FEN format string, cannot import it");
        });
    });
});