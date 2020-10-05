const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.sendEmail = async (options) => {
    const file = __dirname + `/../views/emails/${options.file}.ejs`;
    const compile = ejs.compile(fs.readFileSync(file, 'utf-8'));
    const html = compile({
        url: options.url
    });
    const emailOptions = {
        from: 'Meeti <noreply@meeti.com>',
        to: options.user.email,
        subject: options.subject,
        html
    }
    const send = util.promisify(transport.sendMail, transport);
    return send.call(transport, emailOptions);
}