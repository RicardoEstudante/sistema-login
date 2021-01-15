import * as Yup from 'yup';
import Restaurant from '../../models/Restaurant';

class RestaurantController {
  // Função responsável por criar um usuário
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      phone: Yup.string().required(),
      cnpj: Yup.string().required(),
      password: Yup.string().required().min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const restaurantExists = await Restaurant.findOne({
      where: { email: req.body.email },
    });

    if (restaurantExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, phone, cnpj } = await Restaurant.create(req.body);

    return res.json({
      id,
      name,
      email,
      phone,
      cnpj,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      phone: Yup.string(),
      cnpj: Yup.string(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmationPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const restaurant = await Restaurant.findByPk(req.restaurantId);

    if (email !== restaurant.email) {
      const restaurantExists = await Restaurant.findOne({ where: { email } });

      if (restaurantExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await restaurant.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const { id, name, phone, cnpj } = await restaurant.update(req.body);

    return res.json({
      id,
      name,
      email,
      phone,
      cnpj,
    });
  }
}

export default new RestaurantController();
