if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { info } = require("console");
let express = require("express"),
  path = require("path"),
  nodeMailer = require("nodemailer"),
  bodyParser = require("body-parser");

let app = express();

app.use(express.static("src"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post(`${process.env.URL}`, function (req, res) {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.USER}`,
      pass: `${process.env.PASS}`,
    },
  });
  let mailOptions = {
    to: `${process.env.RECIPIENT}`,
    subject: req.body.subject,
    text: req.body.message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(404);
      res.end();
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    res.send({ messageSent: true });
    res.status(200);
    res.end();
  });
});

let server = app.listen(process.env.PORT, function () {
  let port = server.address().port;
  console.log("Server started at http://localhost:%s", port);
});
