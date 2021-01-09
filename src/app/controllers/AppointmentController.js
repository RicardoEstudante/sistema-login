import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Check if provider_id is a provider
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /* Verifying if provider and user are the same */
    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: 'You can not create an appointments with yourself' });
    }

    /* Ignoring minutes and seconds(18:38:55 => 18:00:00) */
    const hourStart = startOfHour(parseISO(date));

    /* Checking if the time is not in the past */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /* Check date availability () */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id, // Provider that is trying to make an appointment
        canceled_at: null, // If the schedule was not canceled
        date: hourStart, // if it's the same time
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Hour is not availability' });
    }

    /* Creating appointment */
    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    return res.status(200).json(appointments);
  }
}

export default new AppointmentController();
