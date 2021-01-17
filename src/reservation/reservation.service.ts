import {
  BadRequestException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationDto } from './models/reservation.dto';
import { Property } from './models/enums/property.enum';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

const SAG_BASE_URL = 'https://api.mocki.io/v1/fc467680';
const GLUTZ_BASE_URL = 'https://api.mocki.io/v1/291cd555';

@Injectable()
export class ReservationService {
  constructor(private httpService: HttpService) {}
  private generateRandomPincode(): string {
    return `${Math.floor(1000 + Math.random() * 9000)}`;
  }
  private async getSAGPincode(
    validFrom: Date,
    validTo: Date,
    unitId: string,
  ): Promise<string> {
    return await this.httpService
      .post(`${SAG_BASE_URL}/pin-code`, {
        validFrom,
        validTo,
        unitId,
      })
      .pipe(map((response) => response.data))
      .toPromise()
      .then((res) => {
        /// fix:  trailing comma issue fix
        const { pinCode } = JSON.parse(
          res.replace(/\,(?!\s*?[\{\[\"\'\w])/g, ''),
        );

        return pinCode;
      });
  }
  private async getGLUTZPincode(
    name: string,
    unitId: string,
    validFrom: Date,
    validTo: Date,
  ): Promise<string> {
    const user: any = await this.httpService
      .post(`${GLUTZ_BASE_URL}/user`, {
        name,
      })
      .toPromise()
      .then((response) => response.data.data)
      .catch((err) => {
        throw new BadRequestException(err);
      });
    if (!user || !user.id)
      throw new BadRequestException(
        `unable to create user in SAG system for user :${name}`,
      );

    const pinCode = this.generateRandomPincode();
    return await this.httpService
      .post(`${GLUTZ_BASE_URL}/grant-access`, {
        userId: user && user.id,
        unitId,
        validFrom,
        validTo,
        pinCode,
      })
      .toPromise()
      .then(() => {
        return pinCode;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });
  }
  public async getPincodeByReservation(
    reservation: ReservationDto,
  ): Promise<string> {
    const {
      propertyId,
      guestName,
      arrival: validFrom,
      departure: validTo,
      propertyId: unitId,
    } = reservation;
    switch (propertyId) {
      case Property.DE_BE_001:
        return await this.getSAGPincode(validFrom, validTo, unitId);
      case Property.DE_MU_001:
        return await this.getGLUTZPincode(
          guestName,
          unitId,
          validFrom,
          validTo,
        );

      default:
        throw new NotFoundException('invalid Property id');
    }
  }
}
