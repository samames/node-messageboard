const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SG_API_KEY);

const sendWelcomeEmail = async (email, name, id, host, token) => {
  try {
    await sgMail.send({
      to: email,
      from: 'samames@gmail.com',
      subject: 'Welcome',
      text: `Dear ${name}, welcome to the website. http://${host}/users/${id}/${token}`,
    });
  } catch (err) {
    console.error(err.message);
  }
};
const sendResetEmail = async (email, name, token) => {
  await sgMail.send({
    to: email,
    from: 'samames@gmail.com',
    subject: 'Password reset',
    text: `Dear ${name}, here is your password reset link: http://localhost:3000/password-reset/${token}`,
  });
};

module.exports = { sendWelcomeEmail, sendResetEmail };
