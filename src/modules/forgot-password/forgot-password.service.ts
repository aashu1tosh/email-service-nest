import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class ForgotPasswordService {
    constructor(
        // private readonly client: ClientProxy
    ) { }

    async publishForgotPasswordEmail(@Payload() data: any) {
        console.log("🚀 ~ ForgotPasswordService ~ publishForgotPasswordEmail ~ data:", data)
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
