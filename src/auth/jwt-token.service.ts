import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  // Generate JWT
  async generateToken(user: any): Promise<string> {
    const payload = {
      email: user.email,
      googleId: user.googleId,
      id: user._id,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  // Validate JWT
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
