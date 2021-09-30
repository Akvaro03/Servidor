const express = require(`express`);
const mongoose = require(`mongoose`);

const DatosSchema = new mongoose.Schema({
    temp: { type: Array},
    humidity: { type: Array }
});

module.exports = mongoose.model(`datos`, DatosSchema);