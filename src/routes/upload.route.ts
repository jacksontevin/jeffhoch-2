import Router from 'koa-joi-router';
import { upload } from '../controllers/upload.controller';

const router = <any>Router();
router.prefix('/get-url');

router.get('/', [upload]);

export default router;
