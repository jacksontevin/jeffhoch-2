import Router from 'koa-joi-router'

import koaBody from 'koa-body';

import { authUserRegister, verifyOTP, login, recoverPasswordRequest, changePassword, verifyAccountByToken, sendBulkMail } from './../controllers/auth.controllers';
import { userRegisterValidate, loginValidate, recoverPasswordValidate, isEmailUniqueField, isMobileUniqueField, checkRole } from './../validators/auth.validator';

const router = <any> Router();

router.prefix('/auth');

router.post('/register',koaBody (),[userRegisterValidate, checkRole, isEmailUniqueField, authUserRegister])
router.post('/verify-otp',koaBody (),[verifyOTP])
router.post('/verify-account-token',koaBody (),[verifyAccountByToken])
router.post('/login',koaBody (),[loginValidate, login])
router.post('/recover-password-request',koaBody (),[recoverPasswordRequest])
router.post('/recover-password',koaBody (),[recoverPasswordValidate, changePassword])
router.post('/send-mail',koaBody (),[sendBulkMail])

export default router;
