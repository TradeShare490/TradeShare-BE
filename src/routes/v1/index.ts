import { Express } from 'express';
import defaultRoute from './default.route';
import sessionRoute from './session.route';
import userRoute from './user.route'
import userInfoRoute from './userInfo.route'
import accountRoute from './account.route'
module.exports = function (app: Express) {
  // Register the routes
  defaultRoute(app)
  userRoute(app)
  sessionRoute(app)
  userInfoRoute(app)
  accountRoute(app)
  //other routes..
};
