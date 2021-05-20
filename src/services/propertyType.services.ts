import { PropertyType, SubPropertyTypeSchema } from '../models/index';
export default class PropertyTypeService {
  public async save(payload: any) {
    try {
      const data = await PropertyType.create(payload)
      if (data['_id']) return await this.fetchById(data['_id'])
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async update(payload) {
    try {
      const data = await PropertyType.findByIdAndUpdate(payload._id, payload, { new: true })
      .populate('childPropertyType', 'name isActive')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
      if (data['_id']) return { status: 'Success', code: 200, message: 'Property type Update Successfully', data };
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async fetchById(_id: any) {
    try {
      const data = await PropertyType.findOne({ _id })
        .populate('childPropertyType', 'name isActive')
        .populate('createdBy', 'firstName lastName email')
        .populate('updatedBy', 'firstName lastName email')
      if (data['_id']) return { status: 'Success', code: 200, message: '', data };
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async fetchAll(pagination: any, search: any) {
    try {
      const data = await PropertyType.find({ name: search, isActive: pagination.isActive })
        .select(pagination.filed)
        .populate('childPropertyType', 'name isActive')
        .populate('createdBy', 'firstName lastName email')
        .populate('updatedBy', 'firstName lastName email')
        .limit(pagination.perRowPage * 1)
        .sort({ 'createdAt': 'descending' })
        .skip((pagination.currentPage - 1) * pagination.perRowPage);
      return { status: 'Success', code: 200, message: '', data: { pagination, data } };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async fetchCount(pagination: any, search: any) {
    try {
      return await PropertyType.countDocuments({ name: search,isActive: pagination.isActive });
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async delete(_id: any) {
    try {
      const data = await PropertyType.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
      if (data['_id']) return { status: 'Success', code: 200, message: 'Property type Deleted Successfully', data };
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async restore(_id: any) {
    try {
      const data = await PropertyType.findByIdAndUpdate(_id, { isDeleted: false }, { new: true });
      if (data['_id']) return { status: 'Success', code: 200, message: 'Property type Restore Successfully', data };
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async fetchAllPrortySpecific() {
    try {
      const data = await PropertyType.find().select('name');
      return { status: 'Success', code: 200, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async fetchSubPropertyTypeByName(name) {
    try {
      const data = await SubPropertyTypeSchema.find({name});
      return { status: 'Success', code: 200, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async saveSubPropertyType(payload:any) {
    try {
      const data = await SubPropertyTypeSchema.create(payload);
      return { status: 'Success', code: 200, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async fetchAllSubPropertyType() {
    try {
      const data = await SubPropertyTypeSchema.find();
      return { status: 'Success', code: 200, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
}
