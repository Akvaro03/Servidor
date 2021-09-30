const express = require(`express`);
const mongoose = require(`mongoose`);

const HISTORIA = new mongoose.Schema({
    temp: { type: Array},
    // temp: { type: Number},
    // hum: { type: Number },
    // pres: { type: Number },
    // bru: { type: Number },
    // ane: { type: Number },
    // vmax: { type: Number },
    day: { type: Number},
    hours: { type: Number},
    minutes: { type: Number}
});

module.exports = mongoose.model(`HISTORIA`, HISTORIA);