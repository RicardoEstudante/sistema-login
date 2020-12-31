import Sequelize from 'sequelize';

import User from '../app/models/User';
import Restaurant from '../app/models/Restaurant';

import databaseConfig from '../config/database';

const models = [User, Restaurant];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
