import { SetMetadata } from '@nestjs/common';
import { USER_KEY } from '../../../constants/key-decorators';

export const OnlyUserAccess = (key: string) => SetMetadata(USER_KEY, key);
