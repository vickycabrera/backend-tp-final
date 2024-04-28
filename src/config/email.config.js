// config/emailConfig.js
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "vlcabrera92@gmail.com",
        pass: "abwm xbvo jnyc qvzf"
    }
});

module.exports = transport;