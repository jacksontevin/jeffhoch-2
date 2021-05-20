import Router from 'koa-joi-router';

import koaBody  from 'koa-body';

import { propertyChangeStatus } from '../controllers/property.controllers';
import { AdminAuthetication, authenticate } from './../middleware/authentication';
import { fetchPropertyById } from './../controllers/admin/property.controller';
import { fetchPropertiesAdmin } from '../controllers/admin/property.controller';
import { fetchAllUser, fetchAllBrokerList, fetchAllSellerSpecific, fetchSellerWithPropertyCount, fetchUserById, userUpdate } from './../controllers/admin/user.controller';

const router = <any> Router();
router.prefix('/admin');

router.get('/fetch-all-users', [authenticate, AdminAuthetication, fetchAllUser])
router.post('/fetch-users-update', koaBody(), [authenticate, AdminAuthetication, userUpdate])
router.get('/fetch-user-details', [authenticate, AdminAuthetication, fetchUserById]);

router.get('/fetch-seller-details-with-property-counts', [authenticate, AdminAuthetication, fetchSellerWithPropertyCount])

router.get('/fetch-all-broker-list', [authenticate, AdminAuthetication, fetchAllBrokerList])


router.get('/fetch-all-seller-specific', [authenticate, AdminAuthetication, fetchAllSellerSpecific])

router.get('/fetch-all-properties', [authenticate, AdminAuthetication, fetchPropertiesAdmin])

router.get('/fetch-property-by-id/:_id', [authenticate, fetchPropertyById]) // use admin and seller

router.post('/property-change-status', koaBody(), [authenticate, propertyChangeStatus]); // use admin and seller



export default router;
