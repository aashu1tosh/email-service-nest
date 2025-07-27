import { MESSAGE_PATTERNS } from "@/constant/queue.constant";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { ForgotPasswordService } from "./forgot-password.service";

@Controller()
export class ForgotPasswordController {
    private readonly logger = new Logger(ForgotPasswordController.name);

    constructor(private readonly forgotPasswordService: ForgotPasswordService) { }

    @EventPattern(MESSAGE_PATTERNS.FORGOT_PASSWORD)
    async handleForgotPassword(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            await this.forgotPasswordService.publishForgotPasswordEmail(data);
            this.logger.log(`✅ Email sent successfully for: ${data.to}`);
            channel.ack(originalMsg);
        } catch (err) {
            this.logger.error(`❌ Error while handling forgot password for: ${data.to}`, err?.stack);
            channel.nack(originalMsg, false, false); // requeue = false
        }
    }

}
