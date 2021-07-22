const bcrypt = require(`bcrypt`);
const express = require(`express`);
const mongoose = require(`mongoose`);
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    idAr: { type: String, default: "none" },
    ubicacion: { type: String, default: "none" }
});

UserSchema.pre(`save`, function(next) {
    if (this.isNew || this.isModified(`password`)) {
        const document = this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        })
    } else {
        next();
    }
})

UserSchema.methods.isCorrectPassord = function(password, callback) {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

module.exports = mongoose.model(`User`, UserSchema);