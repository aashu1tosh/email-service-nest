import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class ForgotPasswordController {
    // constructor(private readonly forgotPasswordService: ForgotPasswordService) { }

    @EventPattern('forgot-password')
    async handleForgotPassword(@Payload() data: any) {
        console.log("Received forgot password event with data:", data);
        // await this.forgotPasswordService.publishForgotPasswordEmail(data);
    }
}