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
            coordinate = Chess.decode("Z9");

            expect(coordinate).toBe(null);
        });
    });
});