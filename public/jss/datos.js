const express = require(`express`);
const mongoose = require(`mongoose`);

const DatosSchema = new mongoose.Schema({
    temp: { type: Number},
    humidity: { type: Number }
});

module.exports = mongoose.model(`datos`, DatosSchema);