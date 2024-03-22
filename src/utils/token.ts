import { randomBytes } from 'crypto';

export const generateAuthToken = (length: number = 10): string => {
  return randomBytes(length).toString('hex').slice(0, length);
};
