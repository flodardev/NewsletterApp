const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static("static"));

app.listen(process.env.PORT || 3000, function () {
	console.log("Server is running on port 3000");
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const url = "https://us10.api.mailchimp.com/3.0/lists/dd26240356";
	const options = {
		method: "POST",
		auth: "flodardev:f2420b647fc0cb420461f1fe76e61bf0-us10",
	};

	// Make request to Mail Chimp Api
	const request = https.request(url, options, function (response) {
		// On response from API
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
	});

	// Data to be sent to Mail Chimp
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	// Stringify data (Docs can be found on Mail Chimp's API Reference)
	const jsonData = JSON.stringify(data);

	// Write data into the request
	request.write(jsonData);
	// End and Send request
	request.end();
});
