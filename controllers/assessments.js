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
      assessment: assessmentStore.getPlaylist(assessmentID),
    };
    response.render('assessment', viewData);
  },
  
  addSong(request, response) {
    const assessmentID = request.params.id;
    const assessment = assessmentStore.getPlaylist(assessmentID);
    const newSong = {
      id: uuid(),
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    logger.debug('New Song = ', newSong);
    playlistStore.addSong(assessmentID, newSong);
    response.redirect('/assessment/' + assessmentID);
  },
  
  deleteSong(request, response) {
    const assessmentID = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song ${songId} from Assessment ${assessmentID}`);
    playlistStore.removeSong(assessmentID, songId);
    response.redirect('/playlist/' + assessmentID);
  },
};

module.exports = playlist;