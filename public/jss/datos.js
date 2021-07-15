const express = require(`express`);
const mongoose = require(`mongoose`);

const DatosSchema = new mongoose.Schema({
    temp: { type: Number, required: true, },
    humedad: { type: Number, required: true, },
    viento: { type: String, required: true, }
});

module.exports = mongoose.model(`datos`, DatosSchema);