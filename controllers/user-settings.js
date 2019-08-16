"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const gymUtility = require("../controllers/gym-utility");
const memberStore = require('../models/member-store');
const assessmentStore = require("../models/assessment-store")

const userSettings = {

    memberIndex(request, response) {
        logger.info("Member settings rendering");
        const loggedInMember = accounts.getCurrentMember(request);
        const assessments = assessmentStore.getMemberAssessments(loggedInMember.id);
        const sortedAssessments = assessments.sort(function(a, b) {
            return parseFloat(a.dateTime) + parseFloat(b.dateTime);
        });
        const viewData = {
            title: "Member Settings",
            member: loggedInMember,
            firstName: loggedInMember.firstName.toUpperCase(),
            lastName: loggedInMember.lastName.toUpperCase(),
            BMI: memberStore.getMemberBMI(loggedInMember),
            BMICategory: gymUtility.determineBMICategory(memberStore.getMemberBMI(loggedInMember)),
            isIdealWeight: gymUtility.isIdealBodyWeight(loggedInMember, sortedAssessments[0]),
            assessments: assessmentStore.getMemberAssessments(loggedInMember.id),
        };
        logger.info(`${loggedInMember.firstName} ${loggedInMember.lastName} logged in`)
        response.render("membersettings", viewData);
    },

    trainerIndex(request, response) {
        logger.info("Trainer settings rendering");
        const loggedInTrainer = accounts.getCurrentTrainer(request);
        const viewData = {
            title: "Trainer Settings",
            trainer: loggedInTrainer,
            //firstName: loggedInTrainer.firstName.toUpperCase(),
            //lastName: LoggedInTrainer.lastName.toUpperCase(),
            //BMI: memberStore.getMemberBMI(loggedInMember),
            //isIdealWeight: gymUtility.isIdealBodyWeight(loggedInMember, assessmentStore[0]),
           // assessments: assessmentStore.getMemberAssessments(loggedInMember.id),
        };
        logger.info(`${loggedInTrainer.firstName} ${loggedInTrainer.lastName} logged in`)
        response.render("trainersettings", viewData);
    },
};

module.exports = userSettings;
