import { MESSAGE_PATTERNS } from "@/constant/queue.constant";
import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { ForgotPasswordService } from "./forgot-password.service";

@Controller()
export class ForgotPasswordController {

    constructor(private readonly forgotPasswordService: ForgotPasswordService) { }

    @EventPattern(MESSAGE_PATTERNS.FORGOT_PASSWORD)
    async handleForgotPassword(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            await this.forgotPasswordService.publishForgotPasswordEmail(data);
            // ✅ Acknowledge the message after success
            channel.ack(originalMsg);
        } catch (err) {
            console.error('❌ Error handling forgot password:', err);
            // ❌ NACK the message if something fails
            channel.nack(originalMsg, false, false); // requeue = false
        }
    }
}