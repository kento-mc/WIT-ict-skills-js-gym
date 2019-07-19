"use strict";

const logger = require("../utils/logger");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const viewData = {
      title: "Assessment dashboard",
    };
    response.render("dashboard", viewData);
  },
  
  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newAssessment = {
      id: uuid(),
      /*
      userid: loggedInUser.id,
      title: request.body.title,
      songs: [],
      */
    };
    logger.debug('Creating a new Assessment', newAssessment);
    assessmentStore.addAssessment(newAssessment);
    response.redirect('/dashboard');
  },
  
  deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.debug(`Deleting assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
