import { IUserSchema } from "../models/userModel";

class AuthExtensions {
  static GetOutgoingGetMeObjectFromModel(modelObj: IUserSchema, id: string) {
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

export default AuthExtensions;
