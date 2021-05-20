import { MAIL_HOST, MAIL_PASSWORD, MAIL_USER_NAME } from './../utils/config';
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
export default class MailService {
  mailInit() {
    return nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER_NAME,
        pass: MAIL_PASSWORD,
      },
    });
  }
  public async sendMailVerification(email, link) {
    let transporter = await this.mailInit()


    const filePath = path.join(__dirname, '../../templates/mail-template/confirm-account-email.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      link: link,
    };
    const htmlToSend = template(replacements);

    let info = await transporter.sendMail({
      from: MAIL_USER_NAME,
      to: email,
      subject: 'Your Verification Link',
      html: htmlToSend,
    });
  }

  public async changePasswordSendOTP(userInfo: any) {
    let transporter = await this.mailInit()

    const filePath = path.join(__dirname, '../../templates/mail-template/otp.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      otp: userInfo.otp
    };
    const htmlToSend = template(replacements);

    await transporter.sendMail({
      from: MAIL_USER_NAME,
      to: userInfo.email,
      subject: 'Change Password Request --Long isLand',
      html: htmlToSend,
    });
  }

  async saveContactSendMail(userInfo:any) {
    let transporter = await this.mailInit()

    await transporter.sendMail({
      from: MAIL_USER_NAME,
      to: userInfo.email,
      subject: 'Island Support',
      html: `Hello Dear <strong>${userInfo.firstName} ${userInfo.lastName} </strong><br><br>
      hope your query has been resolved`,
    });
  }

  async resolveContactSendMail(userInfo:any) {
    let transporter = await this.mailInit()

    await transporter.sendMail({
      from: MAIL_USER_NAME,
      to: userInfo.email,
      subject: 'Resolved Your Query 🙌 -Island Support',
      html: `Hello Dear <strong>${userInfo.firstName} ${userInfo.lastName} </strong><br><br>
      <strong>your query has been resolved  🙌 </strong>
      <br><br>
      Your Query: ${userInfo.userQuery}
      <br><br>
      Support: ${userInfo.adminResponse}
      <br><br>
      Status: <b style="color:green">Resolved</b>
      <br><br>
      `,
    });
  }
}
