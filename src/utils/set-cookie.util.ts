import { Response } from 'express';
import { TokensPairInterface } from '../auth/types/tokens-pair.interface';

export const setCookieUtil = (
  res: Response,
  { access_token, refresh_token }: TokensPairInterface,
) => {
  res.cookie('access_token', access_token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'strict',
  });
};
