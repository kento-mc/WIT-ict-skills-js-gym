'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

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

  getMemberBMI(member) {
    //const member = memberStore.getMemberById(id);
    const memberAssessments = assessmentStore.getMemberAssessments(member.id);
    if (memberAssessments.length > 0){
      const currentAssessment = memberAssessments[0];
      const bmi = gymUtility.calculateBMI(member, currentAssessment);
      return bmi;
    } else {
        return 0.0;
    }
  },
};

module.exports = memberStore;