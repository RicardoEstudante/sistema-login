import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/user/UserController'; // arrumado
import RestaurantController from './app/controllers/restaurant/RestaurantController'; // arrumado

import ProviderController from './app/controllers/ProviderController';

import UserSessionController from './app/controllers/user/UserSessionController'; // arrumado
import RestaurantSessionController from './app/controllers/restaurant/RestaurantSessionController'; // arrumado

import FileController from './app/controllers/FIleController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store); // arrumado
routes.post('/restaurants', RestaurantController.store); // arrumado

routes.post('/sessions', UserSessionController.store); // arrumado
routes.post('/sessions-restaurant', RestaurantSessionController.store); // arrumado

routes.use(authMiddleware);

routes.put('/users', UserController.update); // arrumado
routes.put('/restaurants', RestaurantController.update); // arrumado

routes.get('/restaurants', ProviderController.index); // arrumado

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.get('/schedule', ScheduleController.index); // teste

routes.post('/files', upload.single('file'), FileController.store); // arrumado

export default routes;
