import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private tokenService: JwtTokenService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const user = await this.tokenService.validateToken(token);
      req.user = user; // Attach user to request
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
