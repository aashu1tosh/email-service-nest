import { MESSAGE_PATTERNS } from "@/constant/queue.constant";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ForgotPasswordService } from "./forgot-password.service";

@Controller()
export class ForgotPasswordController {

    constructor(private readonly forgotPasswordService: ForgotPasswordService) { }

    @EventPattern(MESSAGE_PATTERNS.FORGOT_PASSWORD)
    async handleForgotPassword(@Payload() data: any) {
        this.forgotPasswordService.publishForgotPasswordEmail(data);
    }
}