import { AdminAuthetication, authenticate } from './../middleware/authentication';
import { fetchAllContact, saveContact, fetchContactById, resolveContact, resolveResendMail } from './../controllers/contact.controllers';
import { contactValidate } from './../validators/contact.validator';
import Router from 'koa-joi-router';
import koaBody  from 'koa-body';

const router = <any> Router();
router.prefix('/contact');

router.route({
  method: 'GET',
  path: '/fetch-all',
  handler: [authenticate, AdminAuthetication, fetchAllContact]
});

router.route({
  method: 'GET',
  path: '/fetch-by-id/:_id',
  handler: [authenticate, AdminAuthetication, fetchContactById]
});


router.post('/save', koaBody(),[contactValidate, saveContact])
router.post('/resolve', koaBody(),[authenticate, AdminAuthetication, resolveContact])
router.post('/resolve-resend-mail', koaBody(),[authenticate, AdminAuthetication, resolveResendMail])


export default router;
