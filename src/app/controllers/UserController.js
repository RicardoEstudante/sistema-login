import User from '../models/User';

class UserController {
  // Função responsável por criar um usuário
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // Função responsável listar todos os usuários
  async index(req, res) {
    const users = await User.findAll({ User });

    const allUsers = users.map((user) => user);

    return res.json(allUsers);
  }
}

export default new UserController();
