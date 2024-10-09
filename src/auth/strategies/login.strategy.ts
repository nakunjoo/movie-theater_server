import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'account_name',
    });
  }
  async validate(account_name: string, password: string): Promise<string> {
    return this.authService.loginAdmin(account_name, password);
  }
}
