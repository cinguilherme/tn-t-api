import {checkUserCanCreateRecord} from './index';

describe('Record Logic', () => {
    describe('checkUserCanCreateRecord', () => {
        it('should return false if the user has insufficient credit for the operation', () => {
            const userRecords = [{ amount: 30 }, { amount: 50 }];
            const user = { credit: 100 };
            const operation = { cost: 40 };

            expect(checkUserCanCreateRecord(userRecords as any, user as any, operation as any)).toBeFalsy();
        });

        it('should return true if the user has just enough credit for the operation', () => {
            const userRecords = [{ amount: 50 }, { amount: 50 }];
            const user = { credit: 100 };
            const operation = { cost: 0 };

            expect(checkUserCanCreateRecord(userRecords as any, user as any, operation as any)).toBeTruthy();
        });

        it('should return true if the user has more than enough credit for the operation', () => {
            const userRecords = [{ amount: 30 }, { amount: 50 }];
            const user = { credit: 100 };
            const operation = { cost: 10 };

            expect(checkUserCanCreateRecord(userRecords as any, user as any, operation as any)).toBeTruthy();
        });

        it('should return true if the user has no records but enough credit for the operation', () => {
            const userRecords = [];
            const user = { credit: 50 };
            const operation = { cost: 40 };

            expect(checkUserCanCreateRecord(userRecords as any, user as any, operation as any)).toBeTruthy();
        });
    });
});
