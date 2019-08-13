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