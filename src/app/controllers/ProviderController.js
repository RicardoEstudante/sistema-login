import Restaurant from '../models/Restaurant';
import User from '../models/User';
import File from '../models/File';

class ProviderController {
  // Listing all providers
  async index(req, res) {
    const checkUserExist = await User.findOne({
      where: { id: req.userId },
    });

    console.log(req.userId);

    if (!checkUserExist) {
      return res.status(401).json({ error: 'Restaurant is not exists' });
    }

    const provider = await Restaurant.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(provider);
  }
}

export default new ProviderController();
