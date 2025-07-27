import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Request } from 'express';


@Injectable()
export class IpWhitelistGuard implements CanActivate {
    private readonly logger = new Logger(IpWhitelistGuard.name);
    private readonly whitelist = ['127.0.0.1', '::1'];

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const rawIp = request.ip || request.connection.remoteAddress || '';
        const ip = rawIp.replace(/^::ffff:/, ''); // Normalize IPv6 format

        if (this.whitelist.includes(ip)) {
            this.logger.log(`Allowed IP: ${ip}`);
            return true;
        }

        this.logger.warn(`Blocked IP: ${ip}`);
        throw new ForbiddenException('Access Denied');
    }
}
