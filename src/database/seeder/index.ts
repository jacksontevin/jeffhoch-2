import config from 'config';

import seedCAdminData from './admin';
import propertyTypeSeedData from './propertyType.seeder'
const seedDatabase = (): void => {
  if (config.get('seed_database')) {
    seedCAdminData();
    propertyTypeSeedData()
  }
};

export default seedDatabase;
