import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginAuthenticationGuard extends AuthGuard('local') {}
