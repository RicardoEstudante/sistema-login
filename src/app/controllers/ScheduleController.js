import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Restaurant from '../models/Restaurant';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkRestaurantExist = await Restaurant.findOne({
      where: { id: req.userId },
    });

    if (!checkRestaurantExist) {
      return res.status(401).json({ error: 'Restaurant is not exists' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    console.log(parsedDate);
    console.log(startOfDay());

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
