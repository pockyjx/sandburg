import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as process from 'process';
import { AuthService } from '../../member/application/auth.service';

export class JwtAccessStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY
    });
  }

  validate(payload) {
    return {
      loginId: payload.loginId,
      role: payload.role
    }
  };
}