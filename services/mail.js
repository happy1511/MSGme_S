const nodeMailer = require("nodemailer");

const transport = nodeMailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: "happypatel151103@gmail.com",
      pass: "dbdz ukko vqkt ffmc",
    },
  },
  (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  }
);

const generateHtml = (name, url) => {
  const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password!</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    img {
      max-width: 100%;
      height: auto;
    }

    h1 {
      color: #333;
      text-align: center;
    }

    p {
      color: #555;
      margin-bottom: 15px;
    }

    a {
      color: #007bff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .footer {
      margin-top: 20px;
      text-align: start;
      color: #777;
    }

    .image{
      width: 100px;
      object-fit: contain;
      height: 100px;
    }

    .header{
      text-align: start;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="header">Password Reset Request</h1>
    <p>Hello ${name},</p>
    <p>Someone requested a new password for the MSGme account associated with ${name}.</p>
    <p>No changes have been made to your account yet.</p>
    <p>Link will be expire in 1 hour.</p>
    <p>You can reset your password by clicking the link below:</p>
    <p><a href="${url}" target="_blank">Reset Password</a></p>
    <p>If you did not request a new password, please let us know immediately by replying to this email.</p>
    <p class="footer">Yours, <br>MSGme team</p>
    <img src="https://res.cloudinary.com/dszbuhdfz/image/upload/v1705848217/MSGme/Logo_black_ovghy5.png" alt="Company Logo" class="image">
  </div>
</body>
</html>
`;
  return emailBody;
};

const mail = async (mailId, url) => {
  const mailOptions = {
    from: "MSGme <msgme.gmail.com>",
    to: mailId,
    subject: "reset your password",
    html: generateHtml(mailId, url),
  };

  return transport.sendMail(mailOptions);
};

module.exports = mail;
