import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UserStatus } from 'src/enum/user-status.enum';

export class UserStatusValidationPipes implements PipeTransform {
  readonly userStatus = [UserStatus.ACTIVE, UserStatus.INACTIVE];
  transform(value: any) {
    let val = value.status;
    if (val) {
      val = val.toUpperCase();
      if (!this.isValidStatus(val)) {
        throw new BadRequestException({
          statusCode: 400,
          message: `invalid product status ${val}`,
        });
      }
      value.status = val;
    }

    return value;
  }
  private isValidStatus(status: any) {
    const idx = this.userStatus.indexOf(status);
    return idx !== -1;
  }
}
