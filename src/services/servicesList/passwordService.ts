import bcrypt from "bcryptjs";

const getHashedPassword = async (enteredPassword: string): Promise<string> => {
  return await bcrypt.hash(enteredPassword, 12);
};

const verifyPassword = async (
  enteredPasword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(enteredPasword, hashedPassword);
};

const passwordService = {
  getHashedPassword,
  verifyPassword,
};

export default passwordService;
