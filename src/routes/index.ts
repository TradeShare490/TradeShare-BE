import { Express, Request, Response } from 'express';

module.exports = function (app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello from the TypeScript world!</h1>');
  });

  app.get('/api/check', (req: Request, res: Response) => {
    res.send('<h1>API RUNNING!</h1>');
  });

  app.get('*', (req: Request, res:Response) => {
    res.send('Page NOT-FOUND 404: This will be developed soon. Please contact admin if you need help')
  })
  //other routes..
};
