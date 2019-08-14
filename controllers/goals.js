"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const gymUtility = require("../controllers/gym-utility");
const memberStore = require("../models/member-store");
const assessmentStore = require("../models/assessment-store");
const goalStore = require("../models/goal-store");

const goals = {
    index(request, response) {
        logger.info("Member goals page rendering");
        const loggedInMember = accounts.getCurrentMember(request);
        const viewData = {
            title: "Member goals",
            member: loggedInMember,
            firstName: loggedInMember.firstName.toUpperCase(),
            lastName: loggedInMember.lastName.toUpperCase(),
            BMI: memberStore.getMemberBMI(loggedInMember),
            isIdealWeight: true,
            goals: goalStore.getMemberGoals(loggedInMember.id),
        };
    logger.info(`Viewing ${loggedInMember.firstName} ${loggedInMember.lastName}/'s goals`);
    response.render("goals", viewData);
    },
};

module.exports = goals;