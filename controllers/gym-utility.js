'use strict';

const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');
const logger = require('../utils/logger');

const gymUtility = {

    calculateBMI: function(member, assessment)
    {
        const bmiValue = assessment.weight / Math.pow(member.height, 2);
        //return (bmiValue *100) / 100.0;   // convert to two decimal places
        return Number(bmiValue.toFixed(2));
    },


    determineBMICategory: function(bmiValue)
    {
        let str;
        if (bmiValue < 16) {
            str = "SEVERELY UNDERWEIGHT";
        } else if (bmiValue >= 16 && bmiValue < 18.5) {
            str = "UNDERWEIGHT";
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            str = "NORMAL";
        } else if (bmiValue >= 25 && bmiValue < 30) {
            str = "OVERWEIGHT";
        } else if (bmiValue >= 30 && bmiValue < 35) {
            str = "MODERATELY OBESE";
        } else {
            str = "SEVERELY OBESE";
        }
        return str;
    }

/*
    public static boolean isIdealBodyWeight(Member member, Assessment assessment)
    {
        double maleIdealMemberWeight = (((member.getHeight() - 1.524) / .0254) * 2.3) + 50;
        double femaleIdealMemberWeight = (((member.getHeight() - 1.524) / .0254) * 2.3) + 45.5;

        double weight = member.getStartWeight();

        if (assessment == null) {
            weight = member.getStartWeight();
        } else {
            weight = assessment.getWeight();
        }

        if (member.getGender().equals("M")) {
            if (weight <= maleIdealMemberWeight + .2 && weight >= maleIdealMemberWeight - .2) {
                return true;
            } else {
                return false;
            }
        } else {
            if (weight <= femaleIdealMemberWeight + .2 && weight >= femaleIdealMemberWeight - .2) {
                return true;
            } else {
                return false;
            }
        }
    }
*/
};

module.exports = gymUtility;
