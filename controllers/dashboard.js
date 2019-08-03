"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const memberStore = require('../models/member-store');
const assessmentStore = require("../models/assessment-store")

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      title: "Assessment dashboard",
      BMI: memberStore.getMemberBMI(loggedInMember),
      assessments: assessmentStore.getMemberAssessments(loggedInMember.id),
    };
    logger.info(`${loggedInMember.firstName} ${loggedInMember.lastName} logged in`)
    response.render("dashboard", viewData);
  },
  
  addAssessment(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    
    const today = new Date();
    const date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //const dateTime = date+' '+time;
    
    const newAssessment = {
      id: uuid(),
      memberid: loggedInMember.id,
      //trainerid: ,
      dateTime: date + " " + time,
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
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
