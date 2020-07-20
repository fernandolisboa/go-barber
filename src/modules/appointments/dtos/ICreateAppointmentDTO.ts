import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

type ICreateAppointmentDTO = Pick<Appointment, 'provider_id' | 'date'>

export default ICreateAppointmentDTO
