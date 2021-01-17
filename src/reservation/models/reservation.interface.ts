/* eslint-disable prettier/prettier */

export interface Reservation {
  reservationId: string;
  guestName: string;
  arrival: Date;
  departure: Date;
  propertyId: string;
}
