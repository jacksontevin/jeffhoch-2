import { userStatusEnum, userRoleEnum } from './../enum/user.enum';
import Koa from 'koa';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { saveErrorLogDB } from '../middleware/errorLog';
import { notification, userNotification } from '../middleware/notification';
import InqueryService from '../services/Inquirie.services';
import AuthService from '../services/auth.services';
import MailService from '../services/mail.services';
import { JWT_SECRET_KEY, PASSWORD_SLOT, FRONT_END_URL, DEFAULT_STATUS_CODE_ERROR } from './../utils/config';

export const authUserRegister = async (ctx: Koa.Context) => {
  const authService = new AuthService();
  try {
    const { email, password, role } = ctx.request.body;
    var payload = {
      email,
      role,
      password: '',
      otp: Math.floor(Math.random() * (999999 - 100000)) + 10000,
      otpGenTime: new Date(),
      status: userStatusEnum.FUNNEL_PENDING,
      firstName: '',
      lastName: '',
      mobile: '',
    };
    payload.password = await bcrypt.hash(password, Number(PASSWORD_SLOT));

    const data = await authService.register(payload);
    if (data._id) {
      return (ctx.body = {
        status: 'Success',
        code: 200,
        message: 'Your Registration Successfully',
        data: { redirectInquery: true, _id: data._id },
      });
    } else {
      ctx.status = 500;
      return (ctx.body = { data });
    }
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'User Register')
    ctx.status = 500;
    return (ctx.body = { err });
  }
};
export const verifyOTP = async (ctx: Koa.Context) => {
  const authService = new AuthService();
  const { id, otp } = ctx.request.body;

  if (!id || !otp) {
    ctx.status = 400;
    return (ctx.body = { status: 'Error', code: ctx.status, message: 'Invalid Payload', data: null });
  }
  try {
    const userInfo = await authService.fetchUserById(id);
    if (userInfo.code == 200) {
      if (userInfo.data.otp == otp) {
        const resAccountVerify = await authService.accountVerify(id);
        if (resAccountVerify.code == 200) {
          // const token = jwtToken(resAccountVerify.data)

          // const finalRes = resAccountVerify.data

          ctx.status = 200;
          return (ctx.body = {
            status: 'Success',
            code: ctx.status,
            message: 'Your Account Verify Successfully',
            data: { _id: userInfo.data._id },
          });
        } else {
          ctx.status = 500;
          return (ctx.body = {
            status: 'Error',
            code: ctx.status,
            message: 'Something Went Worng Please Try Again',
            data: null,
          });
        }
      } else {
        ctx.status = 400;
        return (ctx.body = { status: 'Error', code: 400, message: 'OTP Not Match', data: null });
      }
    } else {
      ctx.status = 400;
      return (ctx.body = { status: 'Error', code: userInfo.status, message: 'User Not Found', data: null });
    }
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'verify OTP')
    ctx.status = 500;
    return (ctx.body = { status: 'Error', code: ctx.status, message: 'Something Went Worng', data: err });
  }
};
export const login = async (ctx: Koa.Context) => {
  const { email, password } = ctx.request.body;
  const authService = new AuthService();
  const inqueryService = new InqueryService();
  const mailServie = new MailService();
  const userInfo = await authService.fetchUserByEmail(email);
  if (userInfo.code == 200 && userInfo.data['_id']) {
    const isPasswordValid = <any>await bcrypt.compare(password, userInfo.data.password);
    if (!isPasswordValid) {
      ctx.status = 401;
      return (ctx.body = { status: 'Error', code: ctx.status, message: 'Password Not Match', data: null });
    }
    switch (userInfo.data.status) {
      case userStatusEnum.DISABLE_BY_ADMINISTRATOR: {
        ctx.status = 429;
        return (ctx.body = {
          status: 'Error',
          code: ctx.status,
          message: 'Your Account Disable By Administrator',
          data: null,
        });
      }
      case userStatusEnum.EXPIRED: {
        ctx.status = 401;
        return (ctx.body = { status: 'Error', code: ctx.status, message: 'Your Account Is Deleted', data: null });
      }
      case userStatusEnum.INVALID_LOGIN_ATTEMPTS_RESTRICTION: {
        ctx.status = 403;
        return (ctx.body = {
          status: 'Error',
          code: ctx.status,
          message: 'Your Account Deactive for time',
          data: { _id: userInfo.data._id },
        });
      }
      case userStatusEnum.IS_VERIFY_PENDING: {
        let token = await jwt.sign(
          {
            id: userInfo.data._id,
          },
          JWT_SECRET_KEY,
          {
            expiresIn: '1d',
          }
        );
        let url = `${FRONT_END_URL}/auth/verify-account-by-token?token=${token}`;
        mailServie.sendMailVerification(userInfo.data.email, url);
        ctx.status = 401;
        return (ctx.body = {
          status: 'Error',
          code: ctx.status,
          message: 'Your Account Is Not Verify!. An email has been sent. Please check your inbox ...',
          redirectVerifyOtp: true,
          data: { _id: userInfo.data._id },
        });
      }
      case userStatusEnum.FUNNEL_PENDING: {
        ctx.status = 403;
        return (ctx.body = {
          status: 'Error',
          code: ctx.status,
          message: 'Please Create Inquery!',
          redirectInquery: true,
          data: { _id: userInfo.data._id },
        });
      }
      case userStatusEnum.ACTIVE: {
        if (userInfo.data.role == userRoleEnum.SUPER_ADMIN) {
          const token = jwtToken(userInfo.data);
          ctx.status = 200;
          ctx.body = { status: 'Success', code: ctx.status, message: '', data: { userInfo: userInfo.data, token } };
        } else {
          const inquery = await inqueryService.fetchInqueryByUserId(userInfo.data._id);
          if (inquery.data && inquery.data._id) {
            const token = jwtToken(userInfo.data);
            ctx.status = 200;
            ctx.body = {
              status: 'Success',
              code: ctx.status,
              message: '',
              data: { userInfo: userInfo.data, inquery: inquery.data, token },
            };
          } else {
            ctx.status = 200;
            ctx.body = {
              status: 'Error',
              code: ctx.status,
              message: 'Please Create Inquery!',
              redirectInquery: true,
              data: { _id: userInfo.data._id },
            };
          }
        }
      }
    }
  } else {
    ctx.status = 404;
    ctx.body = { status: 'Error', code: ctx.status, message: 'User Not Found', data: null };
    saveErrorLogDB(ctx, ctx.status ? ctx.status : DEFAULT_STATUS_CODE_ERROR , ctx.body, 'Login')
    return;
  }
};
export const recoverPasswordRequest = async (ctx: Koa.Context) => {
  const { email } = ctx.request.body;
  const authService = new AuthService();
  if (!email) {
    ctx.status = 422;
    ctx.body = { status: 'Error', code: ctx.status, message: 'Email Not Found', data: null };
    return;
  }
  const userInfo = await authService.fetchUserByEmail(email);
  if (userInfo.code == 200 && userInfo.data['_id']) {
    const otp = Math.floor(Math.random() * (999999 - 100000)) + 10000;
    const result = await authService.editUser(userInfo.data['_id'], { otp });
    const mailServie = new MailService()
    mailServie.changePasswordSendOTP(result.data)
    // send Mail
    userNotification('An email has been sent. Please check your inbox ...', userInfo.data['_id'] ,'/auth')
    ctx.status = 200;
    ctx.body = {
      status: 'Success',
      code: ctx.status,
      message: 'An email has been sent. Please check your inbox ...',
      data: { _id: result.data._id },
    };
    return;
  } else {
    ctx.status = 404;
    ctx.body = { status: 'Error', code: ctx.status, message: 'User Not Found', data: null };
    saveErrorLogDB(ctx, ctx.status ? ctx.status : DEFAULT_STATUS_CODE_ERROR , ctx.body, 'recover Password Request')
    return;
  }
};
export const changePassword = async (ctx: Koa.Context) => {
  const { otp, password, _id } = ctx.request.body;
  const authService = new AuthService();
  const userInfo = await authService.fetchUserById(_id);
  if (userInfo.code == 200) {
    if (userInfo.data.otp == otp) {
      const newPassword = await bcrypt.hash(password, Number(PASSWORD_SLOT));
      const result = await authService.editUser(userInfo.data['_id'], { password: newPassword, otp: null });
      if (result.code == 200) {
        userNotification('Your password has been changed successfully! ', userInfo.data['_id'] ,'/auth')
        ctx.status = result.code;
        return (ctx.body = {
          status: 'Success',
          code: ctx.status,
          message: 'Your password has been changed successfully! Thank you ...',
          data: null,
        });
      } else {
        ctx.status = 500;
        return (ctx.body = { status: 'Error', code: ctx.status, message: 'Something Went Worng', data: null });
      }
    } else {
      ctx.status = 400;
      return (ctx.body = { status: 'Error', code: 400, message: 'OTP Not Match', data: null });
    }
  } else {
    ctx.status = 404;
    ctx.body = { status: 'Error', code: ctx.status, message: 'User Not Found', data: null };
    saveErrorLogDB(ctx, ctx.status ? ctx.status : DEFAULT_STATUS_CODE_ERROR , ctx.body, 'User Register')
    return;
  }
};
const jwtToken = (data: any) => {
  return <any>jwt.sign(
    {
      id: data._id,
      role: data.role,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: data.role == userRoleEnum.SUPER_ADMIN ? '1d' : '1d',
    }
  );
};

export const verifyAccountByToken = async (ctx: Koa.Context) => {
  const { token } = ctx.request.body;
  const inqueryService = new InqueryService();
  try {
    const decodedToken = <any>await jwt.verify(token, JWT_SECRET_KEY);
    const authService = new AuthService();
    const resAccountVerify = <any>await authService.accountVerify(decodedToken.id);
    if (resAccountVerify.code == 200) {
      const inquery = await inqueryService.fetchInqueryByUserId(resAccountVerify.data._id);
      if (inquery.data && inquery.data._id) {
        notification(resAccountVerify.data, 'VERIFY')
        const token = jwtToken(resAccountVerify.data);
        ctx.status = 200;
        ctx.body = {
          status: 'Success',
          code: ctx.status,
          message: 'Your Account Verify Successfully',
          redirectInquery: false,
          data: { userInfo: resAccountVerify.data, inquery: inquery.data, token },
        };
      } else {
        ctx.status = 200;
        return (ctx.body = {
          status: 'Error',
          code: ctx.status,
          message: 'Please Create Inquery',
          redirectInquery: true,
          data: { _id: resAccountVerify.data._id },
        });
      }
    } else {
      ctx.status = 500;
      return (ctx.body = {
        status: 'Error',
        code: ctx.status,
        message: 'Something Went Worng Please Try Again',
        data: null,
      });
    }
  } catch (err) {
    saveErrorLogDB(ctx, err.code ?err.code : DEFAULT_STATUS_CODE_ERROR , err, 'verify Account By Token')
    ctx.status = 403;
    return (ctx.body = { message: 'You Are Not Authorized Please Check Mail!', code: 403, data: err });
  }
};

const sendVerificationLink = async (userInfo: any) => {};
export const sendBulkMail = async (ctx: Koa.Context) => {
  const mailServie = new MailService()
  // await mailServie.sendBulkMail()
}
