import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IS_PUBLIC_KEY';

export function IsPublic(): CustomDecorator<string> {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
