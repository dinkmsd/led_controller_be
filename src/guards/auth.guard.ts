import { BusinessExceptions } from '../exceptions/index';
import { TokenGenerator } from './../utils/token-generator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = (request.headers['authorization'] || '').replace(
      'Bearer ',
      '',
    );
    try {
      const verifyTokenForUser = TokenGenerator.verify(token);
      if (!token || !verifyTokenForUser) {
        throw 'Auth error';
      }
      request['user'] = verifyTokenForUser;
    } catch (error) {
      throw BusinessExceptions.unauthorized();
    }

    return true;
  }
}
