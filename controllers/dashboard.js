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
    const loggedInMember = accounts.getCurrentMember(request);
    const newAssessment = {
      id: uuid(),
      memberid: loggedInMember.id,
      //trainerid: ,
      //dateTime: now(),
      weight: 150.0,
      chest: 100,
      thigh: 80,
      upperArm: 65,
      waist: 125.0,
      hips: 110,
      comment: "",
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
