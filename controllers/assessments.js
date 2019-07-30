'use strict';

const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const uuid = require('uuid');

const assessment = {
  index(request, response) {
    const assessmentID = request.params.id;
    logger.debug('Assessment id = ', assessmentID);
    const viewData = {
      title: 'Assessment',
      assessment: assessmentStore.getAssessment(assessmentID),
    };
    response.render('assessment', viewData);
  },
/*  
  addComment(request, response) {
    const assessmentID = request.params.id;
    const assessment = assessmentStore.getPlaylist(assessmentID);
    const newComment = {
      id: uuid(),
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    logger.debug('New Song = ', newComment);
    assessmentStore.addComment(assessmentID, newComment);
    response.redirect('/assessment/' + assessmentID);
  },
  
  deleteComment(request, response) {
    const assessmentID = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song ${songId} from Assessment ${assessmentID}`);
    assessmentStore.removeSong(assessmentID, songId);
    response.redirect('/assessment/' + assessmentID);
  },*/
};

module.exports = assessment;