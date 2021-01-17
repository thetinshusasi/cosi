import { HttpModule, Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [HttpModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
