const nodemailer = require('nodemailer');

//creating a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'shukla.pratham2003@gmail.com',  
        pass: 'jolr coaz agig aaot'   
    }
});

const sendEmail = (recipientEmail, message) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'shukla.pratham2003@gmail.com',    
            to: recipientEmail,             
            subject: 'Message from your website',
            text: message                   
        };

        //send email using the transporter
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(`Error sending email:${error}`);
            } else {
                resolve(`Email sent successfully:${info.response}`);
            }
        });
    });
};

module.exports = sendEmail;
