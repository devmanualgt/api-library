import {
  AuthTokenResult,
  IUseToken,
} from './../modules/auth/interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';

export const useToken = (token: string): IUseToken | string => {
  try {
    const decode = jwt.decode(token) as AuthTokenResult;

    const currentDate = new Date();
    const expirateDate = new Date(decode.exp);

    return {
      sub: decode.sub,
      role: decode.role,
      username: decode.username,
      isExprired: +expirateDate <= +currentDate / 1000,
    };
  } catch (error) {
    return 'Token is invalids';
  }
};
