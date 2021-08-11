const express = require(`express`);
const mongoose = require(`mongoose`);

const DatosSchema = new mongoose.Schema({
    a: { type: Number },
    b: { type: Number }
});

module.exports = mongoose.model(`datos`, DatosSchema);