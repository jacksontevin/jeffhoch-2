import logger from '../../utils/logger';
import { User } from '../../models';
//password P@ssw0rd
const data = [
  {
    "firstName": "Super",
    "lastName": "Admin",
    "email": "admin@admin.com",
    "password": "$2b$10$3lSG1ggsnv9icgSpT9Qlr.z/OV0k.8VhpzLqBQVK6F/JSH6WBYHku",
    "mobile": "+91 8320568938",
    "role": 'SUPER_ADMIN',
    "status": 'ACTIVE',
  }
];

export default (): void => {
  data.map(async (ele: any) => {
    const userInfo = await User.findOne({ email: ele.email });
    if (userInfo.email && userInfo._id) await User.findByIdAndUpdate(userInfo._id, ele, { new: true })
    else await User.findOneAndUpdate(ele, ele, { upsert: true });
  });
  logger.info('Test database seeded');
};
