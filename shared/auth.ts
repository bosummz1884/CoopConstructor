import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Schema for JWT payload
export const tokenPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

// Generate a JWT token
export const generateToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>) => {
  return jwt.sign(
    payload, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

// Verify a JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return tokenPayloadSchema.parse(decoded);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 12);
};

// Verify a password against a hash
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};

// Extract token from Authorization header
export const getTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};
