"use strict";

const logger = require("../utils/logger");
const uuid = require('uuid');

const accounts = require ("./accounts.js");
const gymUtility = require("../controllers/gym-utility");
const memberStore = require("../models/member-store");
const trainerStore = require("../models/trainer-store");
const assessmentStore = require("../models/assessment-store");
const goalStore = require("../models/goal-store");

const goals = {
    index(request, response) {
        const loggedInTrainer = accounts.getCurrentTrainer(request);
        logger.info("Member goals page rendering");
        let member = memberStore.getMemberById(request.params.id);
        if (!member) {
            member = memberStore.getMemberById(assessmentStore.getAssessment(request.params.id).memberid);
        }
        const assessments = assessmentStore.getMemberAssessments(member.id);
        const sortedAssessments = assessments.sort(function(a, b) {
                                    return parseFloat(a.dateTime) + parseFloat(b.dateTime);
                                });
        const goals = goalStore.checkGoals(member.id);
        const sortedGoals = goals.sort(function(a,b) {
                                    return parseFloat(a.deadline) + parseFloat(b.deadline);
                                });
        assessmentStore.updateTrend(member.id);

        const viewData = {
            title: "Member goals",
            member: member,
            trainer: loggedInTrainer,
            firstName: member.firstName.toUpperCase(),
            lastName: member.lastName.toUpperCase(),
            BMI: memberStore.getMemberBMI(member),
            BMICategory: gymUtility.determineBMICategory(memberStore.getMemberBMI(member)),
            isIdealWeight: gymUtility.isIdealBodyWeight(member, sortedAssessments[0]),
            latestAssessment: sortedAssessments[0],
            goals: sortedGoals,
        };
    logger.info(`Viewing ${member.firstName} ${member.lastName}\'s goals`);
    response.render("goals", viewData);
    },

    addGoal(request, response) {
        let member = memberStore.getMemberById(request.params.id);
        if (!member) {
            member = memberStore.getMemberById(assessmentStore.getAssessment(request.params.id).memberid);
        }
        const dateString = request.body.deadline;
        let isWeight = false;
        if (request.body.category == "weight") {
            isWeight = true;
        }

        const goal = {
            id: uuid(),
            memberid: member.id,
            trainerid: "",
            category: request.body.category,
            target: request.body.target,
            deadline: assessmentStore.formattedDate(dateString),
            dateString: dateString,
            isOpen: true,
            isAchieved: false,
            isMissed: false,
            status: "Open",
            isWeight: isWeight,
        }
        goalStore.addGoal(goal);
        logger.info(`Adding ${request.body.category} goal for ${member.firstName} ${member.lastName}, with a deadline of ${request.body.deadline}`);
        response.redirect(`/member/${member.id}/goals`);
    }
};

module.exports = goals;