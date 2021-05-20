import Router from 'koa-joi-router';

import koaBody from 'koa-body';

import { fetchTrendingProperty, fetchPropertyTypeWiseProperty, fetchFunnelProperty, fetchRecentUpdatedProperty, search, updateProperty } from './../controllers/property.controllers';
import {
  saveProperty,
  fetchAll,
  fetchById,
  fetchSimilarProperty,
  proertyFilter,
  fetchSpecificProperty,
  propertyBaseOnInquery,
} from '../controllers/property.controllers';
import { authenticate } from '../middleware/authentication';
const router = <any>Router();
router.prefix('/property');

router.route({
  method: 'GET',
  path: '/fetch-all',
  handler: [fetchAll],
});

router.route({
  method: 'GET',
  path: '/fetch-by-id/:_id',
  handler: [authenticate, fetchById],
});

router.route({
  method: 'GET',
  path: '/fetch-similar/:_id',
  handler: [fetchSimilarProperty],
});

router.route({
  method: 'GET',
  path: '/specific-property',
  handler: [fetchSpecificProperty],
});

router.route({
  method: 'GET',
  path: '/property-base-on-user-inquery',
  handler: [authenticate, propertyBaseOnInquery],
});

router.post('/save', koaBody(), [authenticate, saveProperty]);
router.post('/update', koaBody(), [authenticate, updateProperty]);

router.post('/fetch-property-filter', koaBody(), [proertyFilter]);
router.get('/fetch-trending-properties', [fetchTrendingProperty]);

router.get('/fetch-categoties-wise-properties', [fetchPropertyTypeWiseProperty]);

router.get('/search', [search]);


router.route({
  method: 'GET',
  path: '/fetch-funnel-property',
  handler: [authenticate, fetchFunnelProperty],
});

router.route({
  method: 'GET',
  path: '/fetch-recent-uploaded-property',
  handler: [fetchRecentUpdatedProperty],
});
export default router;
