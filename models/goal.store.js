'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

    store: new JsonStore('./models/goal-store.json', { goals: [] }),
    collection: 'goals',

    getAllGoals() {
        return this.store.findAll(this.collection);
    },

    getGoal(id) {
        return this.store.findOneBy(this.collection, { id: id });
    },

    getMemberGoalss(memberid) {
        return this.store.findBy(this.collection, { memberid: memberid });
    },

    addGoal(assessment) {
        this.store.add(this.collection, goal);
        this.store.save();
    },

    removeGoal(id) {
        const assessment = this.getGoal(id);
        this.store.remove(this.collection, goal);
        this.store.save();
    },

    removeAllGoals() {
        this.store.removeAll(this.collection);
        this.store.save();
    },
};

module.exports = goalStore;