'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const accounts = require ("../controllers/accounts.js");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("../controllers/gym-utility");

const memberStore = {

  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  removeMember(id) {
    const member = this.getMemberById(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  setGender(gender) {
    // const member = accounts.getCurrentMember(request);
    if (gender.charAt(0) == 'M' || gender.charAt(0) == 'm') {
      gender = "M";
    } else if (gender.charAt(0) == 'F' || gender.charAt(0) == 'f') {
      gender = "F";
    } else {
      gender = "Unspecified";
    }
    return gender;
  },

  getMemberBMI(member) {
    //const member = memberStore.getMemberById(id);
    const memberAssessments = assessmentStore.getMemberAssessments(member.id);
    const sortedAssessments = memberAssessments.sort(function(a, b) {
      return parseFloat(a.dateTime) + parseFloat(b.dateTime);
    });
    if (memberAssessments.length > 0){
      const currentAssessment = memberAssessments[0];
      const bmi = gymUtility.calculateBMI(member, currentAssessment);
      return bmi;
    } else {
        return 0.0;
    }
  },

  goalsOpen(member) {
    const goals = member.goals;
    let openGoals = 0;
    if (goals) {
      for (let i = 0; i < goals.length; i++) {
          if (member.goals[i].isOpen) {
          openGoals++;
        }
      }
      return openGoals;
    } else {
      return 0;
    }
  },

  goalsAchieved(member) {
    const goals = member.goals;
    let achievedGoals = 0;
    if (goals) {
      for (let i = 0; i < goals.length; i++) {
        if (member.goals[i].isAchieved) {
          achievedGoals++;
        }
      }
      return achievedGoals;
    } else {
      return 0;
    }
  },

  goalsMissed(member) {
    const goals = member.goals;
    let missedGoals = 0;
    if (goals) {
      for (let i = 0; i < goals.length; i++) {
        if (member.goals[i].isMissed) {
          missedGoals++;
        }
      }
      return missedGoals;
    } else {
      return 0;
    }
  },
};

module.exports = memberStore;