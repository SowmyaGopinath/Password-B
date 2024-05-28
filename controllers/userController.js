import mongoose from "mongoose";
import passwordmanager from "../schema/userSchema.js";
import nodemailer from "nodemailer";

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'amudhavan.episode@gmail.com',
        pass: 'zxce hzly mpsl imxv'
    },
    tls: {
        rejectUnAuthorized: true
    }
});

// Helper function to send OTP email
function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: '20uca022@rmv.ac.in',
        to: email,
        subject: 'OTP for Login',
        text: `Your OTP for verify email : ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const userController = {};

userController.authenticate = (req, res) => {
    passwordmanager.findOne({ username: req.body.username })
        .then(usr => {
            if (!usr) {
                res.status(400).send({ message: 'user not found!' });
            } else if (usr.password !== req.body.password) {
                res.status(400).send({ message: 'password is invalid' });
            } else {
                res.status(200).json(usr);
            }
        }).catch(err => {
            console.log(err);
            console.log("validation failed!");
        })
};

userController.checkIfUserExists = (req, res) => {
    passwordmanager.findOne({ username: req.body.username })
        .then(usr => {
            if (!usr) {
                res.status(404).send({ message: 'user not found!' });
            } else {
                res.status(200).json(usr);
            }
        }).catch(err => {
            console.log(err);
            console.log("Error occured while finding user");
            res.status(500).send({ message: 'Error occured while finding user' });
        })
}

userController.addUserDetails = (req, res) => {
    const newUser = new passwordmanager({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save().then(usr => {
        if (!usr) {
            console.log("Error: User not saved.");
            res.status(500).send({ message: "Error while saving user data" })
        } else {
            console.log("User saved successfully:", usr);
            res.status(200).send({ message: "Successfully saved User details" })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: "Error while saving user data" })
    })
}

userController.addApp = (req, res) => {
    passwordmanager.findOneAndUpdate({ username: req.body.username }, { $push: { apps: req.body.app } }, { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                console.dir(updatedUser);
                res.status(200).json(updatedUser);
            } else {
                console.log("user not found!");
                res.status(400).send({ message: "user not found!" });
            }
        }).catch(e => {
            console.log("Failed to update the user. Error occurred " + e);
            res.status(500).send({ message: "Internal server error. Failed to update the user" });
        })
}

userController.deleteApp = (req, res) => {
    passwordmanager.findOneAndUpdate({ username: req.body.username }, { $pull: { apps: { name: req.body.appName } } }, { returnDocument: 'after' })
        .then(updatedUser => {
            if (updatedUser) {
                console.dir(updatedUser);
                res.status(200).json(updatedUser);
            } else {
                console.log("user not found!");
                res.status(400).send({ message: "user not found!" });
            }
        }).catch(e => {
            console.log("Failed to update the user. Error occurred " + e);
            res.status(500).send({ message: "Internal server error. Failed to update the user" });
        })
}

let generatedOTP = null;

userController.sendOTP = (req, res) => {
    const { email } = req.body;
    generatedOTP = generateOTP(); // Store the generated OTP
    sendOTPEmail(email, generatedOTP);
    res.status(200).send({ message: "OTP sent successfully" });
};

userController.getGeneratedOTP = (req, res) => {
    if (generatedOTP) {
        res.status(200).send({ otp: generatedOTP });
        console.log('generated OTP',generateOTP);
    } else {
        res.status(404).send({ message: "OTP not generated yet" });
    }
};

export default userController;