'use strict';

const memberStore = require('../models/member-store');
const trainerStore = require('../models/trainer-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('playlist', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.gender = memberStore.setGender(request.body.gender);
    member.id = uuid();
    member.openGoals = 0;
    member.achievedGoals = 0;
    member.missedGoals = 0;
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    accounts.authenticate(request, response);
    //response.redirect('/');
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (member) {
      if (request.body.password == member.password) {
        response.cookie('member', member.email);
        logger.info(`logging in ${member.email}`);
        response.redirect('/dashboard');
      } else {
        response.redirect('/login');
      }
    } else if (trainer) {
      if (request.body.password == trainer.password) {
        response.cookie('trainer', trainer.email);
        logger.info(`logging in ${trainer.email}`);
        response.redirect('/trainerdashboard');
      } else {
        response.redirect('/login');
      }
    } else {
      response.redirect('/login');
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.member;
    return memberStore.getMemberByEmail(memberEmail);
  },

  memberUpdate(request, response) {
    const member = accounts.getCurrentMember(request);
    if (member) {
      logger.info("Updating Member Info");
      if (request.body.firstName) {
        member.firstName = request.body.firstName;
      }
      if (request.body.lastName) {
        member.lastName = request.body.lastName;
      }
      if (request.body.gender) {
        member.gender = memberStore.setGender(request.body.gender);
      }
      if (request.body.email) {
        member.email = request.body.email;
      }
      if (request.body.password) {
        member.password = request.body.password;
      }
      if (request.body.address) {
        member.address = request.body.address;
      }
      if (request.body.height) {
        member.height = request.body.height;
      }
      if (request.body.startingWeight) {
        member.startingWeight = request.body.startingWeight;
      }
      //memberStore.save();
      response.redirect("/member");
    }
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getTrainerByEmail(trainerEmail);
  },

  trainerUpdate(request, response) {

  },
};

module.exports = accounts;