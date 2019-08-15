'use strict';

const express = require('express');
const router = express.Router();

const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js');
const assessments = require('./controllers/assessments.js');
const goals = require('./controllers/goals.js');
const accounts = require('./controllers/accounts.js');
const userSettings = require('./controllers/user-settings');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

router.get('/dashboard', dashboard.index);
router.get('/trainerdashboard', dashboard.trainerIndex);
router.get('/trainerdashboard/deletemember/:id', dashboard.deleteMember);
router.get('/dashboard/deleteassessment/:id', dashboard.deleteAssessment);
router.post('/dashboard/addassessment', dashboard.addAssessment);

router.get('/member', userSettings.memberIndex);
router.post('/member/update', accounts.memberUpdate);
router.get('/trainer', userSettings.trainerIndex);
router.post('/trainer/update', accounts.trainerUpdate);
router.get('/members/:id', dashboard.memberInfo);
router.post('/members/assessment/:id/addcomment', dashboard.addComment);

router.get('/member/goals', goals.index);
router.post('/member/goals/addgoal', goals.addGoal);

router.get('/about', about.index);

module.exports = router;
