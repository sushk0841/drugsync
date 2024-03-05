// patients appointment scehma

const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    // medicalCondition: {
    //     type: String,
    //     required: true
    // },
    // specialization: {
    //     type: String,
    //     required: true
    // },
    // doctorName: {
    //     type: String,
    //     required: true
    // },
    // consultancyFees: {
    //     type: Number,
    //     required: true
    // },
    // appointmentDate: {
    //     type: Date,
    //     required: true
    // },
    // appointmentTime: {
    //     type: String,
    //     required: true
    // },
    // status: {
    //     type: String,
    //     default: 'Pending'
    // }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;