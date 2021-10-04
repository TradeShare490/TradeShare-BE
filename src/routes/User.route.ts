import express, { Express, Request, Response } from 'express';
import UserService from '../services/User.service'

const userRoute = (app: Express) => {
  const userService = new UserService()
  const router = express.Router()

  router.post('/', async (req: Request, res: Response) => {
    res.send(await userService.createUser(req.body));
  });

  router.get('/:email',async (req: Request, res: Response) => {
    res.send(await userService.getUser(req.params));
  });

  router.patch('/:email', async (req: Request, res:Response) => {
    res.send(await userService.updateUser(req.params.email, req.body))
  })

  router.delete('/:email', async (req: Request, res:Response) => {
    res.send(await userService.deleteUser(req.params.email))
  })

  app.use('/account/', router)
};

export default userRoute