import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { ReservationDto } from './models/reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('pincode')
  // @UsePipes(ValidationPipe)
  async createPincode(@Body() reservation: ReservationDto): Promise<string> {
    return await this.reservationService.getPincodeByReservation(reservation);
  }
}
