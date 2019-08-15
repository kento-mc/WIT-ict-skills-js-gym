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
            BMICategory: gymUtility.determineBMICategory(memberStore.getMemberBMI(loggedInMember)),
            isIdealWeight: gymUtility.isIdealBodyWeight(loggedInMember, assessmentStore[0]),
            goals: goalStore.checkGoals(loggedInMember.id), //goalStore.getMemberGoals(loggedInMember.id),
        };
    logger.info(`Viewing ${loggedInMember.firstName} ${loggedInMember.lastName}\'s goals`);
    response.render("goals", viewData);
    },

    addGoal(request, response) {
        //
    }
};

module.exports = goals;