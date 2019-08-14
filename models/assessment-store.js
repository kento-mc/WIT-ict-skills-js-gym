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

  /*addSong(id, song) {
    const playlist = this.getPlaylist(id);
    playlist.songs.push(song);
    
    let duration = 0;
    
    for (let i = 0; i < playlist.songs.length; i++) {
      duration += playlist.songs[i].duration;
    }
    playlist.duration = duration;
    this.store.save();
  },

  removeSong(id, songId) {
    const playlist = this.getPlaylist(id);
    const songs = playlist.songs;
    _.remove(songs, { id: songId});
    this.store.save();
  },*/
};

module.exports = assessmentStore;