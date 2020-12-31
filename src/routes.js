import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import RestaurantController from './app/controllers/RestaurantController';
import SessionRestaurantController from './app/controllers/SessionRestaurantController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/restaurant', RestaurantController.store);
routes.post('/sessions-restaurant', SessionRestaurantController.store);

routes.put('/users', authMiddleware, UserController.update);
routes.put('/restaurants', authMiddleware, RestaurantController.update);
// routes.get('/users', UserController.index);

export default routes;
