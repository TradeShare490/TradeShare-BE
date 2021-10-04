import { Express } from 'express';
import defaultRoute from './default.route';
import userRoute from './User.route'

module.exports = function (app: Express) {
  // Register the routes
  defaultRoute(app)
  userRoute(app)
  //other routes..
};
