import { AdminAuthetication, authenticate } from './../middleware/authentication';
import { fetchErrorById } from './../controllers/error.controllers';
import { fetchContactById } from './../controllers/contact.controllers';
import Router from 'koa-joi-router';
import { fetchAllError } from '../controllers/error.controllers';

const router = <any> Router();
router.prefix('/error');

router.route({
  method: 'GET',
  path: '/fetch-all',
  handler: [authenticate, AdminAuthetication, fetchAllError]
});

router.route({
  method: 'GET',
  path: '/fetch-by-id/:_id',
  handler: [authenticate, AdminAuthetication, fetchErrorById]
});

export default router;
