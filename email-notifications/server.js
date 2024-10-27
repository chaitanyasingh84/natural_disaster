const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // For example, Gmail; replace with your SMTP provider if needed
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'newhacks2024.natural@gmail.com', // Your email address
        pass: 'TESTING!'    // Your email password or app-specific password
    }
});

// Email sending endpoint
app.post('/send-email', (req, res) => {
    const { email, commodity } = req.body;

    const mailOptions = {
        from: 'newhacks2024.natural@gmail.com',
        to: email,
        subject: `Update on ${commodity}`,
        text: `Hello, the commodity "${commodity}" is back in stock!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Failed to send email' });
        } else {
            console.log(`Email sent: ${info.response}`);
            res.status(200).send({ message: 'Email sent successfully' });
        }
    });
});

// Start server
const PORT = process.env.PORT || 993;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});