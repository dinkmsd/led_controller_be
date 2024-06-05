import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@utils/decorator/public.decorator';
import { isNil } from 'ramda';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private isBearerToken(authorization: string | string[]): boolean {
    const authorizationString = Array.isArray(authorization)
      ? authorization[0]
      : authorization;

    return !!authorizationString && authorizationString.startsWith('Bearer ');
  }

  private extractToken(authorization: string): string {
    return authorization.slice(7);
  }

  // private throwUnauthorizedError(): never {
  //   throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED);
  // }

  // async validateIdToken(IdToken: string) {
  //   const token = new CognitoIdToken({
  //     IdToken,
  //   });

  //   const payload = token.decodePayload();
  //   if (isNil(payload) || isNil(payload.email)) {
  //     throw new UnauthorizedException(AUTH_ERRORS.JWT_INVALID);
  //   }
  //   return payload;
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // const request = context.switchToHttp().getRequest();
    // const authorization = request.headers.authorization;

    // if (!authorization || !this.isBearerToken(authorization)) {
    //   this.throwUnauthorizedError();
    // }

    // const token = this.extractToken(authorization);

    // const payload = await this.validateIdToken(token);

    // if (isNil(payload['custom:userId'])) {
    //   this.throwUnauthorizedError();
    // }

    // const user = await this.userService.findById(payload['custom:userId']);

    // if (isNil(user)) {
    //   this.throwUnauthorizedError();
    // }

    // request.user = user;
    // const allowUserTypes = [USER_TYPE.STAFF];
    // if (
    //   allowUserTypes.includes(user.userType) &&
    //   'roleId' in user.additionalInfo
    // ) {
    //   const roleId = user.additionalInfo.roleId;
    //   if (isNil(roleId)) {
    //     this.throwUnauthorizedError();
    //   }
    //   request.role = await this.roleService.findById(roleId.toString());
    // }

    // return true;
  }
}
