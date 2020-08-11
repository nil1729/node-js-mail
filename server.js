if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({ path: './config.env' });
}
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.render('contact');
});

app.post('/send', (req, res) => {
	const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
        <li>Name: ${req.body.name} </li>
        <li>Company: ${req.body.company} </li>
        <li>Email: ${req.body.email} </li>
        <li>Phone: ${req.body.phone} </li>
    </ul>
    <h3>Message<h3>
        <p style="margin-right:1rem">${req.body.message}</p>
    `;

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.NODE_SENDER_MAIL,
			pass: process.env.NODE_SENDER_MAIL_PASSWORD,
		},
	});
	let mailOptions = {
		from: '"Nodemailer Contact"',
		to: process.env.NODE_MAIL_RECEIVER,
		subject: 'Contact Request via Nodemailer',
		html: output,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		res.redirect('/');
	});
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
