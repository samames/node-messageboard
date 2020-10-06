const nodemailer = require('nodemailer');

/**
 * sendEmail
 * @param {Object} mailObj - Email meta data and body
 * @param {String} from - Email address of the sender
 * @param {Array} recipients - Array of recipients email address
 * @param {String} subject - Subject of the email
 * @param {String} message - message
 */
const sendEmail = async (mailObj) => {
  const { from, recipients, subject, message } = mailObj;

  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user: 'samames@gmail.com',
        pass: process.env.SIB_SMTP_KEY,
      },
    });

    // send mail with defined transport object
    let mailStatus = await transporter.sendMail({
      from: from, // sender address
      to: recipients, // list of recipients
      subject: subject, // Subject line
      text: message, // plain text
    });

    console.log(`Message sent: ${mailStatus.messageId}`);
    return `Message sent: ${mailStatus.messageId}`;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};
const sendWelcomeEmail = async (email, name, id, host, token) => {
  const mailObj = {
    from: 'samames@gmail.com',
    recipients: [email],
    subject: 'Welcome',
    message: `<p>Dear ${name}, welcome to the website. <a href="http://${host}/users/${id}/${token}">Click here</a> to verify your email address.</p>`,
  };

  sendEmail(mailObj).then((res) => {
    console.log(res);
  });
};
const sendResetEmail = async (email, name, token) => {
  const mailObj = {
    from: 'samames@gmail.com',
    recipients: [email],
    subject: 'Password reset',
    message: `<p>Dear ${name}, here is your password reset link: <a href="http://localhost:3000/password-reset/${token}">Click me!</a></p>`,
  };

  sendEmail(mailObj).then((res) => {
    console.log(res);
  });
};

module.exports = { sendWelcomeEmail, sendResetEmail };
