import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        // private readonly client: ClientProxy
    ) { }

    async publishForgotPasswordEmail(data: any) {

    }
}
