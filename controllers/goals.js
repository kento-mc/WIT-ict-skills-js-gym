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
            latestAssessment: assessmentStore.getMemberAssessments(loggedInMember.id)[0],
            goals: goalStore.checkGoals(loggedInMember.id), //goalStore.getMemberGoals(loggedInMember.id),
        };
    logger.info(`Viewing ${loggedInMember.firstName} ${loggedInMember.lastName}\'s goals`);
    response.render("goals", viewData);
    },

    addGoal(request, response) {
        const loggedInMember = accounts.getCurrentMember(request);

        const goal = {
            id: uuid(),
            memberid: loggedInMember.id,
            trainerid: "",
            category: request.body.category,
            target: request.body.target,
            deadline: request.body.deadline,
            isOpen: true,
            isAchieved: false,
            isMissed: false,
            status: "Open",
        }
        goalStore.addGoal(goal);
        logger.info(`Adding ${request.body.category} goal for ${loggedInMember.firstName} ${loggedInMember.lastName}, with a deadline of ${request.body.deadline}`);
        response.redirect('/member/goals');
    }
};

module.exports = goals;