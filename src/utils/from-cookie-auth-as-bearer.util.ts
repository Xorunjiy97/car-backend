import { Request } from 'express';
import { TokenTypeEnum } from '../auth/types/token-type.enum';

export function fromCookieAuthAsBearer(tokenType: TokenTypeEnum) {
  return function (request: Request) {
    const cookie = request.cookies[tokenType];

    if (!cookie) {
      return null;
    }

    return cookie;
  };
}
