const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Appointment = require('./models/appointment');

require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set('view engine', "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/appointment-history', async (req, res) => {
    try {
        // Fetch appointment data from the database
        const appointments = await Appointment.find({ patientUid: req.user.uid });

        // Render the appointment history page with appointment data
        res.render('appointment-history', { appointments });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.get('/cancel-appointment/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        // Logic to cancel appointment (e.g., update status to "Cancelled") goes here

        res.redirect('/appointment-history');
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


// CRUD operations for patient registration
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password == cpassword) {
            const registerPatient = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password: password,
                confirmpassword: cpassword
            });

            const registered = await registerPatient.save();
            res.status(201).render("register");
        } else {
            res.send("Passwords do not match");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email: email });

        if (!user) {
            return res.status(400).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Pass the first name to the userPanel.hbs template
            res.status(200).render("userPanel", { firstname: user.firstname, lastname: user.lastname });
            alert("you have succesfully login in to the system")
        } else {
            res.status(400).send("Invalid email or password");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// CRUD operations for appointments
app.post('/appointment', async (req, res) => {
    try {
        const appointmentData = req.body;
        const newAppointment = new Appointment(appointmentData);

        await newAppointment.save();

        res.render('userPanel')
        alert("you have succesfuuly created an appointment")
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});