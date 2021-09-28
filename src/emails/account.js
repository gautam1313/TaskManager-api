const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: "sebkm80@gmail.com",
    subject: "Welcome to Task family",
    text: `We are delighted to have you ${name}. Looking forward to work with you from here on.`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((e) => {
      console.error(e);
    });
};

const sendCancellationEmail = (email, name) => {
  const msg = {
    to: email,
    from: "sebkm80@gmail.com",
    subject: "Account removed from Task manager app",
    text: `Sad to see you leave ${name}. Do give us a feedback.`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Cancellation Email sent");
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
