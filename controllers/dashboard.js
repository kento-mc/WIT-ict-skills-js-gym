"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const gymUtility = require("../controllers/gym-utility");
const memberStore = require('../models/member-store');
const assessmentStore = require("../models/assessment-store");
const goalStore = require("../models/goal-store");

const dashboard = {
  index(request, response) {
    logger.info("Dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const assessments = assessmentStore.getMemberAssessments(loggedInMember.id);
    const sortedAssessments = assessments.sort(function(a, b) {
            return parseFloat(a.dateTime) + parseFloat(b.dateTime);
          });   // used https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects-by-property
    assessmentStore.updateTrend(loggedInMember.id);
    /*let goalsOpen = "";
      if (memberStore.goalsOpen(loggedInMember) == 1) {
        goalsOpen = `${memberStore.goalsOpen(loggedInMember)} goal`;
      } else {
        goalsOpen = `${memberStore.goalsOpen(loggedInMember)} goals`;
      }
    let goalsAchieved = "";
    let goalsMissed = "";*/
    const viewData = {
      title: "Member dashboard",
      member: loggedInMember,
      firstName: loggedInMember.firstName.toUpperCase(),
      lastName: loggedInMember.lastName.toUpperCase(),
      BMI: memberStore.getMemberBMI(loggedInMember),
      BMICategory: gymUtility.determineBMICategory(memberStore.getMemberBMI(loggedInMember)),
      isIdealWeight: gymUtility.isIdealBodyWeight(loggedInMember, sortedAssessments[0]),
      goals: goalStore.checkGoals(loggedInMember.id),
      goalsOpen: memberStore.goalsOpen(loggedInMember),
      goalsAchieved: memberStore.goalsAchieved(loggedInMember),
      goalsMissed: memberStore.goalsMissed(loggedInMember),
      /*goalsOpen: goalsOpen,
      goalsAchieved: goalsAchieved,
      goalsMissed: goalsMissed,*/
      assessments: sortedAssessments,
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
    const assessments = assessmentStore.getMemberAssessments(member.id);
    const sortedAssessments = assessments.sort(function(a, b) {
      return parseFloat(a.dateTime) + parseFloat(b.dateTime);
    });
    assessmentStore.updateTrend(member.id);

    const viewData = {
      title: "Member detail",
      member: member,
      firstName: member.firstName.toUpperCase(),
      lastName: member.lastName.toUpperCase(),
      BMI: memberStore.getMemberBMI(member),
      BMICategory: gymUtility.determineBMICategory(memberStore.getMemberBMI(member)),
      isIdealWeight: gymUtility.isIdealBodyWeight(member, sortedAssessments[0]),
      goals: goalStore.checkGoals(member.id),
      goalsOpen: memberStore.goalsOpen(member),
      goalsAchieved: memberStore.goalsAchieved(member),
      goalsMissed: memberStore.goalsMissed(member),
      assessments: sortedAssessments,
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
    const dateString = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

    //const dateTime = date+' '+time;
    
    const newAssessment = {
      id: uuid(),
      memberid: loggedInMember.id,
      //trainerid: ,
      dateTime: assessmentStore.formattedDate(dateString),
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
