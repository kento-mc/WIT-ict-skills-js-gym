"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const gymUtility = require("../controllers/gym-utility");
const memberStore = require('../models/member-store');
const assessmentStore = require("../models/assessment-store")

const dashboard = {
  index(request, response) {
    logger.info("Dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    let goalsOpen = "";
      if (memberStore.goalsOpen(loggedInMember) == 1) {
        goalsOpen = `${memberStore.goalsOpen(loggedInMember)} goal`;
      } else {
        goalsOpen = `${memberStore.goalsOpen(loggedInMember)} goals`;
      }
    let goalsAchieved = "";
    let goalsMissed = "";
    const viewData = {
      title: "Member dashboard",
      member: loggedInMember,
      firstName: loggedInMember.firstName.toUpperCase(),
      lastName: loggedInMember.lastName.toUpperCase(),
      BMI: memberStore.getMemberBMI(loggedInMember),
      BMICategory: gymUtility.determineBMICategory(memberStore.getMemberBMI(loggedInMember)),
      isIdealWeight: gymUtility.isIdealBodyWeight(loggedInMember, assessmentStore[0]),
      goals: loggedInMember.goals,
      goalsOpen: goalsOpen,
      goalsAchieved: goalsAchieved,
      goalsMissed: goalsMissed,
      assessments: assessmentStore.getMemberAssessments(loggedInMember.id),
    }
    logger.info(`${loggedInMember.firstName} ${loggedInMember.lastName} logged in`);
    response.render("dashboard", viewData);
  },

  trainerIndex(request, response) {
    logger.info("Trainer dashboard rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const viewData = {
      title: "Trainer dashboard",
      members: memberStore.getAllMembers(),
    };
    logger.info(`${loggedInTrainer.firstName} ${loggedInTrainer.lastName} logged in`)
    response.render("trainerdashboard", viewData);
  },

  memberInfo(request, response) {
    logger.info("Member detail dashboard rendering")
    let member = memberStore.getMemberById(request.params.id);
    if (!member) {
      member = memberStore.getMemberById(assessmentStore.getAssessment(request.params.id).memberid);
    }
    //const assessment  = assessmentStore.getMemberAssessments()
    const viewData = {
      title: "Member detail",
      member: member,
      firstName: member.firstName.toUpperCase(),
      lastName: member.lastName.toUpperCase(),
      BMI: memberStore.getMemberBMI(member),
      isIdealWeight: gymUtility.isIdealBodyWeight(member, assessmentStore[0]),
      assessments: assessmentStore.getMemberAssessments(member.id),
    };
    logger.info(`Viewing ${member.firstName} ${member.lastName}/'s info`);
    response.render("memberdetail", viewData);
  },

  deleteMember(request, response) {
    const memberid = request.params.id;
    const member = memberStore.getMemberById(memberid);
    logger.debug(`Deleting member ${member.firstName} ${member.lastName}`);
    memberStore.removeMember(memberid);
    memberStore.store.save();
    response.redirect('/trainerdashboard');
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
    loggedInMember.numAssessments = assessmentStore.getMemberAssessments(loggedInMember.id).length;
    memberStore.store.save();
    response.redirect('/dashboard');
  },
  
  deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    const member = memberStore.getMemberById(assessmentStore.getAssessment(assessmentId).memberid);
    logger.debug(`Deleting assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    member.numAssessments = assessmentStore.getMemberAssessments(member.id).length;
    memberStore.store.save();
    response.redirect('/dashboard');
  },

  addComment(request, response) {
    const assessment = assessmentStore.getAssessment(request.params.id);
    const member = memberStore.getMemberById(assessment.memberid);
    assessment.comment = request.body.comment;
    //assessmentStore.save();
    response.redirect(`/members/${member.id}`);
    logger.info(`Comment "${assessment.comment}" added to assessment dated ${assessment.dateTime} for ${member.firstName} ${member.lastName}`)
  },
};

module.exports = dashboard;
