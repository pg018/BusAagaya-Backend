"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthExtensions {
    static GetOutgoingGetMeObjectFromModel(modelObj, id) {
        return {
            id,
            displayName: modelObj.displayName,
            emailId: modelObj.emailId,
            mobileNumber: modelObj.mobileNumber,
            dateOfBirth: modelObj.dateOfBirth,
            dateOfJoining: modelObj.dateOfJoining,
            type: modelObj.type,
        };
    }
}
exports.default = AuthExtensions;
