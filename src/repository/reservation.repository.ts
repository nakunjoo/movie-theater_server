import { Reservation } from 'src/entity/reservation.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {}
