'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const memberStore = require("../models/member-store");

const assessmentStore = {

  store: new JsonStore('./models/assessment-store.json', { assessments: [] }),
  collection: 'assessments',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessment(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },
  
  getMemberAssessments(memberid) {
    return this.store.findBy(this.collection, { memberid: memberid });
  },

  addAssessment(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeAssessment(id) {
    const assessment = this.getAssessment(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  removeAllAssessments() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  formattedDate(dateString) {
    const today = new Date();
    const timeString = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = dateString + " " + timeString;
    return dateTime;
  },

  numAssessments(memberid) {
    const num = this.getMemberAssessments(memberid).length;
    let formattedNum = "";
    if (num == 1) {
      formattedNum = `${num} assessment`
    } else {
      formattedNum = `${num} assessments`
    }
    return formattedNum
  },

  updateTrend(memberid) {
    const assessments = assessmentStore.getMemberAssessments(memberid);
    const sortedAssessments = assessments.sort(function(a, b) {
                                return parseFloat(a.dateTime) + parseFloat(b.dateTime);
                              });
    if (sortedAssessments.length >= 2)
    {
      for (let i = 0; i < sortedAssessments.length - 1; i++)
      {
        if (parseFloat(sortedAssessments[i].weight) <= parseFloat(sortedAssessments[i+1].weight)) {
          sortedAssessments[i].trendIsPositive = true;
        } else {
          sortedAssessments[i].trendIsPositive = false;

        }
      }
    }
  },
};

module.exports = assessmentStore;