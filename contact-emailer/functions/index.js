const functions = require("firebase-functions");

const nodemailer = require('nodemailer');

const firebase = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore")

const cors = require('cors')({ origin: true });
const fbApp = firebase.initializeApp({
    databaseURL: process.env.DATABASEURL,
    apiKey: process.env.WEBAPI,
    projectId: process.env.PROJECTID,
    authDomain: process.env.AUTHDOMAIN,
})

const db = getFirestore();


exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.saveData = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            functions.logger.info("Logs for savedaata!", { structuredData: true });
            let email = request.body.email;
            functions.logger.info("Email" + email, { structuredData: true });

            const res = await db.collection("users").add({ "email": email });

            return response.send(200, { message: "Email Saved successfully" });

        } catch (error) {
            return response.send(500, { message: error });
        }
    });
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