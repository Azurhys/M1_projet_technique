const transporter = require('../config/nodemailer');

const testEmail = async () => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'amerpillat@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email sent from Node.js',
    html: '<h1>This is a test email sent from Node.js</h1>'
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

testEmail();
