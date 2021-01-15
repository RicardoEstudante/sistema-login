import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Appointment from '../models/Appointment';
import File from '../models/File';

class AppointmentController {
  // Listing all appointments
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: Restaurant,
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  // creating an appointments
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
    const isProvider = await Restaurant.findOne({
      where: {
        id: provider_id,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /* Verifying if provider and user are the same */
    // if (req.userId === provider_id) {
    //   return res
    //     .status(401)
    //     .json({ error: 'You can not create an appointments with yourself' });
    // }

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

    console.log(req.userId);
    console.log(provider_id);

    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    return res.status(200).json(appointments);
  }
}

export default new AppointmentController();
