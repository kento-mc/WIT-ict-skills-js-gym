'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');

const goalStore = {

    store: new JsonStore('./models/goal-store.json', { goals: [] }),
    collection: 'goals',

    getAllGoals() {
        return this.store.findAll(this.collection);
    },

    getGoal(id) {
        return this.store.findOneBy(this.collection, { id: id });
    },

    getMemberGoals(memberid) {
        return this.store.findBy(this.collection, { memberid: memberid });
    },

    addGoal(goal) {
        this.store.add(this.collection, goal);
        this.store.save();
    },

    removeGoal(id) {
        const goal = this.getGoal(id);
        this.store.remove(this.collection, goal);
        this.store.save();
    },

    removeAllGoals() {
        this.store.removeAll(this.collection);
        this.store.save();
    },

    checkGoals(memberid) {
        const goals = this.getMemberGoals(memberid);
        const assessments = assessmentStore.getMemberAssessments(memberid);
        const sortedAssessments = assessments.sort(function(a, b) {
            return parseFloat(a.dateTime) + parseFloat(b.dateTime);
        });
        const latestAssessment = sortedAssessments[0];

        const now = new Date();

        for (let i =0; i < goals.length; i++) {

            const category = goals[i].category;
            const deadline = goals[i].deadline;

            if (category == "weight") {
                if (latestAssessment.weight <= goals[i].target && latestAssessment.dateTime <= deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = true;
                    goals[i].isMissed = false;
                } else if (now > deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = true;
                } else {
                    goals[i].isOpen = true;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = false;
                }
            } else if (category == "chest") {
                if (latestAssessment.chest <= goals[i].target && latestAssessment.dateTime <= deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = true;
                    goals[i].isMissed = false;
                } else if (now > deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = true;
                } else {
                    goals[i].isOpen = true;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = false;
                }
            } else if (category == "thigh") {
                if (latestAssessment.thigh <= goals[i].target && latestAssessment.dateTime <= deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = true;
                    goals[i].isMissed = false;
                } else if (now > deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = true;
                } else {
                    goals[i].isOpen = true;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = false;
                }
            } else if (category == "bicep") {
                if (latestAssessment.bicep <= goals[i].target && latestAssessment.dateTime <= deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = true;
                    goals[i].isMissed = false;
                } else if (now > deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = true;
                } else {
                    goals[i].isOpen = true;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = false;
                }
            } else if (category == "waist") {
                if (latestAssessment.waist <= goals[i].target && latestAssessment.dateTime <= deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = true;
                    goals[i].isMissed = false;
                } else if (now > deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = true;
                } else {
                    goals[i].isOpen = true;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = false;
                }
            } else if (category == "hips") {
                if (latestAssessment.hips <= goals[i].target && latestAssessment.dateTime <= deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = true;
                    goals[i].isMissed = false;
                } else if (now > deadline) {
                    goals[i].isOpen = false;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = true;
                } else {
                    goals[i].isOpen = true;
                    goals[i].isAchieved = false;
                    goals[i].isMissed = false;
                }
            }

            if (goals[i].isOpen) {
                goals[i].status = "Open";
            } else if (goals[i].isAchieved) {
                goals[i].status = "Achieved!";
            } else {
                goals[i].status = "Missed :(";
            }

        }   // close for loop

        this.store.save();
        return goals;
    }
};

module.exports = goalStore;