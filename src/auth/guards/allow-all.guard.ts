import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class AllowAllGuard implements CanActivate {
  canActivate(): boolean {
    // TODO: Disable and Implement authentication strategy later on, for now we will allow all requests
    return true;
  }
}
