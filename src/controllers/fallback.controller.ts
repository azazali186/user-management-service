import { All, BadRequestException, Controller } from '@nestjs/common';

@Controller()
export class FallbackController {
  // Fallback route
  @All('*')
  handleFallback() {
    throw new BadRequestException({
      statusCode: 400,
      message: `bad request`,
    });
  }
}
