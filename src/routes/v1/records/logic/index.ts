import {User} from "../../../../models/User";
import {Operation} from "../../../../models/Operation";
import {Record} from "../../../../models/Record";

export const checkUserCanCreateRecord = (userRecords: Record[], user: User, operation: Operation): boolean => {

    const totalCosts = userRecords
        .map((re) => re.amount)
        .reduce((a, b) => a + b, 0);

    return !(user.credit < totalCosts ||
        user.credit < totalCosts + operation.cost);
}