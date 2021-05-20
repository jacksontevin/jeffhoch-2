import Router from 'koa-joi-router';

import koaBody from 'koa-body';

import { whoAmI, updateProfile, updateAccountPic, changePassword } from '../controllers/accounts.controllers';
import { saveContact } from '../controllers/contact.controllers';
import { authenticate } from '../middleware/authentication';
import { updateProfileValidation } from '../validators/accounts.validator';
import { contactValidate } from '../validators/contact.validator';

const router = <any>Router();
router.prefix('/accounts');

router.post('/save', koaBody(), [contactValidate, saveContact]);
router.get('/who-am-i', [authenticate, whoAmI]);
router.post('/update', koaBody(), [authenticate, updateProfileValidation, updateProfile]);
router.post('/change-pic', koaBody(), [authenticate, updateAccountPic]);
router.post('/change-password', koaBody(), [authenticate, changePassword]);

export default router;
