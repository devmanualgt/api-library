import { ROLES } from 'src/constants/roles';

export interface PayloadToken {
  role: ROLES;
  sub: string;
  username: string;
}

export interface AuthBody {
  username: string;
  password: string;
}

export interface AuthTokenResult {
  role: string;
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  role: string;
  sub: string;
  username: string;
  isExprired: boolean;
}
