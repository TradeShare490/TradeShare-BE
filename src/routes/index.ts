import { Express } from 'express';
import defaultRoute from './default.route';


module.exports = function (app: Express) {
  // Register the routes
  defaultRoute(app)
  //other routes..
};
