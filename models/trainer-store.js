'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const accounts = require ("../controllers/accounts.js");
const assessmentStore = require("../models/assessment-store");
const gymUtility = require("../controllers/gym-utility");

const trainerStore = {

    store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
    collection: 'trainers',

    getAllTrainers() {
        return this.store.findAll(this.collection);
    },

    addTrainer(trainer) {
        this.store.add(this.collection, trainer);
        this.store.save();
    },

    getTrainerById(id) {
        return this.store.findOneBy(this.collection, { id: id });
    },

    getTrainerByEmail(email) {
        return this.store.findOneBy(this.collection, { email: email });
    },

    setGender(gender) {
        if (gender.charAt(0) == 'M' || gender.charAt(0) == 'm') {
            gender = "M";
        } else if (gender.charAt(0) == 'F' || gender.charAt(0) == 'f') {
            gender = "F";
        } else {
            gender = "Unspecified";
        }
        return gender;
    },
};

module.exports = trainerStore;