import jwt from "jsonwebtoken";

const createToken = (userObject: object): string => {
  return jwt.sign({ userObject }, "secretkey", {
    algorithm: "HS256",
    expiresIn: 3600,
  });
};

const decodedIncomingToken = (token: string): jwt.JwtPayload => {
  const decoded = jwt.decode(token, { json: true });
  if (!decoded) {
    throw new Error("Auth Failed");
  }
  return decoded;
};

// returns true if token is expired
const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodedIncomingToken(token);
  const timeDecided = decodedToken.exp!;
  const timeHappened = new Date().getTime() / 1000;
  if (timeHappened >= timeDecided) {
    return true;
  }
  return false;
};

const JWTService = {
  createToken,
  isTokenExpired,
  decodedIncomingToken,
};

export default JWTService;
