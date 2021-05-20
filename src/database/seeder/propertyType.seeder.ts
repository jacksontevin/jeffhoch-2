import { PropertyType } from '../../models';
import logger from '../../utils/logger';
//password P@ssw0rd
const data = [
  {
    isActive: true,
    name: "Office Space",
    createdAt: new Date(),
    updatedAt: new Date(),
    childPropertyType: null,
    createdBy: null,
    updatedBy: null,
    allowEdit: false
  },
  {
    isActive: true,
    name: "Industrial Space",
    createdAt: new Date(),
    updatedAt: new Date(),
    childPropertyType: null,
    createdBy: null,
    updatedBy: null,
    allowEdit: false
  },
  {
    isActive: true,
    name: "Flex Space",
    createdAt: new Date(),
    updatedAt: new Date(),
    childPropertyType: null,
    createdBy: null,
    updatedBy: null,
    allowEdit: false
  }
];

export default (): void => {
  data.map(async (ele: any) => {
    try {
      await PropertyType.findOneAndUpdate(ele, ele, { upsert: true });
    } catch (error) {

    }
  });
  logger.info('Test database seeded');
};
