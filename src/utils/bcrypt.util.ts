import * as bcrypt from 'bcrypt';

export const generateHash = async (value: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(value, salt);
};

export const compareHash = async (compareData: string, hash: string) => {
  return await bcrypt.compare(compareData, hash);
};
