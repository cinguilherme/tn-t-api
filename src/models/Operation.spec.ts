import { performOperation } from './Operation'

describe('Operation', () => {

    describe('performOperation', () => {

        it('should perform a add operation', function () {
            expect(performOperation({id: "1", type: "addition", cost: 1}, 1, 2)).toEqual(3);
        });

        it('should perform a subtraction operation', function () {
            expect(performOperation({id: "1", type: "subtraction", cost: 1}, 1, 2)).toEqual(-1);
        });

        it('should perform a multiplication operation', function () {
            expect(performOperation({id: "1", type: "multiplication", cost: 1}, 1, 2)).toEqual(2);
        });

        it('should perform a division operation', function () {
            expect(performOperation({id: "1", type: "division", cost: 1}, 1, 2)).toEqual(0.5);
        });

        it('should perform a square root operation', function () {
            expect(performOperation({id: "1", type: "square_root", cost: 1}, -1, 4)).toEqual(2);
        });

        it('should perform a random string operation', function () {
            expect(performOperation({id: "1", type: "random_string", cost: 1})).toEqual(expect.any(String));
        });

    });

});