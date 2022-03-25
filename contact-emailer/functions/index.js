const functions = require("firebase-functions");

const nodemailer = require('nodemailer');

const admin = require("firebase-admin");

const cors = require('cors')({ origin: true });

var serviceAccount = require("../keys/sidehustle-firestore-creds.json");

admin.initializeApp(serviceAccount)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'temporaryemail10296@gmail.com',
        pass: '22oct1997'
    }
});

exports.sendEmail = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        let vals = JSON.parse(JSON.stringify(request.body));
        vals = JSON.parse(vals)

        const mailOptions = {
            from: `temporaryemail10296@gmail.com`,
            to: 'kunjshah45@gmail.com',
            subject: 'kunjshah.dev - contact form message',
            html: `<h1>Kunj Shah Portfolio</h1>
                            <p>
                                <b>First Name: </b>${vals.fname}<br>
                                <b>Last Name: </b>${vals.lname}<br>
                                <b>Email: </b>${vals.email}<br>
                                <b>Subject: </b>${vals.subject}<br>
                                <b>Message: </b>${vals.message}<br>
                            </p>`
        };

        return transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                return response
                    .status(500)
                    .json({ message: error });
            }
            return response
                .status(200)
                .json({ message: "Email send successfully" });
        });
    })

});