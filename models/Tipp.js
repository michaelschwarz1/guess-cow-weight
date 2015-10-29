var mongoose = require('mongoose');

var TippSchema = new mongoose.Schema({
    tippnr: Number,
    vorname: String,
    nachname: String,
    tippgewicht: Number,
    ort: String,
    strasse: String,
    plz: Number,
    abweichung: Number,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Tipp', TippSchema);