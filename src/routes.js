import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ Message: 'Hello world' }));

export default routes;
