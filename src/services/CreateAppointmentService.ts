import Appointment from '../models/Appointment'
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

import AppError from '../errors/AppError'

import {startOfHour} from 'date-fns'

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({provider_id, date}:Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository)


        const appointmentDate = startOfHour(date)

        const FindAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate
        )

        if(FindAppointmentInSameDate){
            throw new AppError('This appointment is already booked')            
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        })

        await appointmentsRepository.save(appointment)

        return appointment
    }    
}

export default CreateAppointmentService