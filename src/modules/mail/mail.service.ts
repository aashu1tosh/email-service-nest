import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        // private readonly client: ClientProxy
    ) { }

    async publishForgotPasswordEmail(data: any) {
        let log: any
        try {
            // await this.client.emit('forgot-password.queue', data).toPromise();
            console.log("check")
        } catch (err) {
            console.log("🚀 ~ MailService ~ publishForgotPasswordEmail ~ err:", err)
            // log.error = err?.message || 'Unknown error';
        }
    }
}
