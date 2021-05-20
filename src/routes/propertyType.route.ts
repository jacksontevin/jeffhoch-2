import { AdminAuthetication } from './../middleware/authentication';
import Router from 'koa-joi-router';

import koaBody from 'koa-body';

import {
  add,
  update,
  fetchById,
  deletePropertyType,
  restore,
  fetchAll,
  saveSubPropertyType,
  fetchAllSubPropertyType
} from '../controllers/PropertyType.controllers';
import { fetchContactById } from './../controllers/contact.controllers';
import { isSubPropertyTypeUniqueField } from './../validators/PropertyType.validator';
import { saveValidate, updateValidate, isUniqueField, saveSubProperyTypeValidator } from '../validators/PropertyType.validator';

const router = <any>Router();

router.prefix('/propertyType');

router.route({
  method: 'GET',
  path: '/fetch-all',
  handler: [fetchAll],
});

router.route({
  method: 'GET',
  path: '/property-type/:_id',
  handler: fetchById,
});

router.route({
  method: 'DELETE',
  path: '/delete/:_id',
  handler: deletePropertyType,
});

router.route({
  method: 'POST',
  path: '/restor/:_id',
  handler: restore,
});

router.route({
  method: 'GET',
  path: '/fetch-all-sub-property',
  handler: [fetchAllSubPropertyType]
});

router.route({
  method: 'GET',
  path: '/fetch-sub-property-by-id/:_id',
  handler: [fetchContactById]
});

router.post('/add', koaBody(), [AdminAuthetication, saveValidate, isUniqueField, add]);
router.post('/update', koaBody(), [AdminAuthetication, updateValidate, isUniqueField, update]);
router.post('/save-sub-property', koaBody(),[saveSubProperyTypeValidator, isSubPropertyTypeUniqueField, saveSubPropertyType])


export default router;
