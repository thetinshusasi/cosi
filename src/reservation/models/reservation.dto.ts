/* eslint-disable prettier/prettier */

import { IsDateString, IsNotEmpty } from 'class-validator';
export class ReservationDto {
  @IsNotEmpty()
  reservationId: string;

  @IsNotEmpty()
  guestName: string;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  arrival: Date;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  departure: Date;

  @IsNotEmpty()
  propertyId: string;
}
