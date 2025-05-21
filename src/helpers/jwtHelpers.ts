import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export interface TPayloadToken {
    userId: string;
    email: string;
    role: string;
}

const generateToken = (
    payload: TPayloadToken,
    secret: Secret,
    expiresIn: string
) => {
    const options: SignOptions = {
        algorithm: 'HS256',
        expiresIn
    } as jwt.SignOptions;
    const tokens = jwt.sign(payload, secret, options);
    return tokens;
};

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
    generateToken,
    verifyToken
};
