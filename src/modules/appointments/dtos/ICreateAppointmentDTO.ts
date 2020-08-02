import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

type ICreateAppointmentDTO = Pick<
  Appointment,
  'provider_id' | 'customer_id' | 'date'
>

export default ICreateAppointmentDTO
