"use strict";

const logger = require("../utils/logger");

const accounts = {
  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },
};

module.exports = accounts;