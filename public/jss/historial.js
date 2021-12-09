const express = require(`express`);
const mongoose = require(`mongoose`);

const HISTORIA = new mongoose.Schema({
    temp: { type: Array},
    hum: { type: Array },
    day: { type: Number},
    hours: { type: Number},
    minutes: { type: Number},
    seconds: { type: Number}
});

module.exports = mongoose.model(`HISTORIA`, HISTORIA);