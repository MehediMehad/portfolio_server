import bcrypt from 'bcrypt';
import config from '../config';


// Hash password
export const hashPasswordGenerator = async (password: string): Promise<string> => {
    const saltRounds = config.jwt.bcrypt_salt_rounds || 12; // Salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> =>
    await bcrypt.compare(password, hashedPassword);