import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import Restaurant from '../models/Restaurant';

import authConfig from '../../config/auth';

class SessionRestaurantController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ where: { email } });

    if (!restaurant) {
      return res.status(401).json({ error: 'restaurant not found' });
    }

    if (!(await restaurant.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = restaurant;

    return res.json({
      restaurant: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionRestaurantController();
