import Router from 'koa-joi-router';

import koaBody  from 'koa-body';

import { fetchPropertiesSeller } from './../controllers/seller.controllers';
import { sellerAuthetication, authenticate } from './../middleware/authentication';

const router = <any> Router();
router.prefix('/seller');

router.get('/fetch-all-properties', [authenticate, sellerAuthetication, fetchPropertiesSeller])


export default router;
