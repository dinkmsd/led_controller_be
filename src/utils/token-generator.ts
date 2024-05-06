import { BusinessExceptions } from '../exceptions';
import * as jwt from 'jsonwebtoken';

interface ITokenData {
  email: string;
}

export class TokenGenerator {
  static generate(user, expiredInSec: number): string {
    const jwtToken = jwt.sign(user, process.env.JWT_SECRET_KEY as string, {
      algorithm: 'RS256',
    });

    return jwtToken;
  }

  static verify(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw BusinessExceptions.unauthorized();
      }
      throw error;
    }
  }
}
