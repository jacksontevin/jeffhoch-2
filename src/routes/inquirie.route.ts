import { saveInqueryValidator, updateInqueryValidator } from './../validators/inquirie.validator';
import { fetchInqueryById, updateInquery } from './../controllers/inquirie.controllers';
import Router from 'koa-joi-router';
import { fetchAllUser, saveInquery } from '../controllers/inquirie.controllers';
import koaBody  from 'koa-body';

const router = <any> Router();
router.prefix('/inquiries');

router.route({
  method: 'GET',
  path: '/fetch-all',
  handler: [fetchAllUser]
});

router.route({
  method: 'GET',
  path: '/fetch-by-id/:_id',
  handler: [fetchInqueryById]
});


router.post('/save', koaBody(),[saveInqueryValidator, saveInquery])
router.post('/update', koaBody(),[updateInqueryValidator, updateInquery])


export default router;
