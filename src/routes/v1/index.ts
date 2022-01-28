import { Express } from 'express';
import defaultRoute from './default.route';
import sessionRoute from './session.route';
import userRoute from './user.route'
import userInfoRoute from './userInfo.route'
import accountRoute from './account.route'
import positionsRoute from './positions.route'
import activitiesRoute from './activities.route'
import searchRoute from './search.route';

module.exports = function (app: Express) {
  // Register the routes
  defaultRoute(app)
  userRoute(app)
  sessionRoute(app)
  userInfoRoute(app)
  accountRoute(app)
  positionsRoute(app)
  activitiesRoute(app)
  searchRoute(app)
  //other routes..
};
