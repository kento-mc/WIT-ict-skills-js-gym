"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const memberStore = require('../models/member-store');
const assessmentStore = require("../models/assessment-store")

const userSettings = {

    memberIndex(request, response) {
        logger.info("Member settings rendering");
        const loggedInMember = accounts.getCurrentMember(request);
        const viewData = {
            title: "Member Settings",
            member: loggedInMember,
            firstName: loggedInMember.firstName.toUpperCase(),
            lastName: loggedInMember.lastName.toUpperCase(),
            BMI: memberStore.getMemberBMI(loggedInMember),
            isIdealWeight: true,
            assessments: assessmentStore.getMemberAssessments(loggedInMember.id),
        };
        logger.info(`${loggedInMember.firstName} ${loggedInMember.lastName} logged in`)
        response.render("membersettings", viewData);
    },

    trainerIndex(request, response) {
        //...
    },
};

module.exports = userSettings;
