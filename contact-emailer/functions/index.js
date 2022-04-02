const functions = require("firebase-functions");

const nodemailer = require('nodemailer');

const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });

admin.initializeApp()

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

exports.sendEmailContact = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        try {
            let vals = JSON.parse(JSON.stringify(request.body));

            const mailOptions = {
                from: `temporaryemail10296@gmail.com`,
                to: 'kunjshah45@gmail.com',
                subject: 'kunjshah.dev - contact form message',
                html: `<h1>Kunj Shah Portfolio</h1>
                            <p>
                                <b>First Name: </b>${vals.fname}<br>
                                <b>Last Name: </b>${vals.lname}<br>
                                <b>Email: </b>${vals.email}<br>
                                <b>Message: </b>${vals.message}<br>
                            </p>`
            };

            return transporter.sendMail(mailOptions, (error, data) => {
                if (error) {
                    return response.send(500, { message: error });
                }
                return response.send(200, { message: "Email send successfully" });
            });

        } catch (error) {
            return response.send(500, { message: error });
        }

    });
});