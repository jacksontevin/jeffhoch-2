import { Inquirie } from '../models';
import PropertyType from '../models/PropertyType.modal';
import propertyModal from '../models/property.modal';

const specificData = 'address.sortAddress constructionStatus title ownership payment _id saleType propertyType images status'
export default class PropertyService {
  public async saveProperty(payload: any) {
    try {
      const data = await propertyModal.create(payload);
      if (data['_id']) return { status: 'Success', code: 200, message: 'Property Added Successfully', data };
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async editProperty(payload: any) {
    try {
      const data = await propertyModal.findByIdAndUpdate(payload._id, payload, { new: true }).populate(['seller', 'propertyType', 'subPropertyType', 'approvedBy'])
      if (data['_id']) return { status: 'Success', code: 200, message: 'Property Updated Successfully', data}
      else return { status: 'Success', code: 404, message: '', data}
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }

  public async fetchUserCount() {
    try {
      return await propertyModal.countDocuments();
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchAll(pagination: any) {
    try {
      const data = await propertyModal
        .find()
        .populate(['seller', 'propertyType', 'subPropertyType', 'approvedBy'])
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage);
      return { status: 'Success', code: 200, message: '', data: { pagination, data: data } };
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchById(_id: any) {
    try {
      const data = await propertyModal.findOne({ _id }).populate(['seller', 'propertyType', 'subPropertyType', 'approvedBy']);
      if (data['_id']) return { status: 'Success', code: 200, message: '', data: data };
      else return { status: 'Error', code: 404, message: '', data: null };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async fetchSimilarProperty(_id: any) {
    const currentProperty = await propertyModal.findOne({ _id })
    try {
      const data = await propertyModal.find({
        $and: [
          { 'address.city': currentProperty.address.city },
          { 'address.state': currentProperty.address.state },
          { status: ['Active'] },
        ],
        $or: [
          // { title: currentProperty.title },
          // { bathroom: currentProperty.bathroom },
          { 'address.pinCode': currentProperty.address.pinCode },
          { 'address.landmarks': currentProperty.address.landmarks },
          { constructionStatus: currentProperty.constructionStatus },
          // { driveInDoors: currentProperty.driveInDoors },
          // { facing: currentProperty.facing },
          // { floor: currentProperty.floor },
          { furnishing: currentProperty.furnishing },
          // { heavyPower: currentProperty.heavyPower },
          // { highCeilings: currentProperty.highCeilings },
          { ownership: currentProperty.ownership },
          // { parkingSpots: currentProperty.parkingSpots },
          // { saleType: currentProperty.saleType },
          // { slidingDoor: currentProperty.slidingDoor },
          // { standingBuilding: currentProperty.standingBuilding },
          // { totalRoom: currentProperty.totalRoom },
          // { workingWithAnotherBroker: currentProperty.workingWithAnotherBroker }
        ]
      }).limit(12);
      return { status: 'Success', code: 200, message: '', data: data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async propertyFilter(body: any) {
    const { propertyType, state, totalRoom, search, paymentType } = body;
    try {
      let find = {}
      if(propertyType) find['propertyType'] = propertyType
      if (totalRoom) find['totalRoom'] = totalRoom
      if (paymentType) find['payment.type'] = paymentType
      if (state) find['address.state'] = new RegExp(state || '', 'i');

      var regexSearch = new RegExp(search || '', 'i');
      const data = await propertyModal.find({
        ...find, $or: [
          { title: regexSearch },
          { subTitle: regexSearch },
          { 'address.sortAddress': regexSearch },
          { 'address.fullAddress': regexSearch },
          { 'address.city': regexSearch },
          { 'address.landmarks': regexSearch },
          { 'address.pinCode': regexSearch },
          { 'saleType': regexSearch },
          { 'furnishing': regexSearch },
          { 'payment.type': regexSearch },
          { 'payment.currency': regexSearch },
      ]});
      return { status: 'Success', code: 200, message: '', data: data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async fetchTrendingProperty(body: any) {
    try {
      const data = await propertyModal.find().sort({'views': 'descending'}).limit(10).select(specificData);
      return { status: 'Success', code: 200, message: '', data: data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async fetchSpecificProrerty() {
    try {
      const data = await propertyModal
        .find()
        .populate('propertyType')
        .select(specificData);
      return { status: 'Success', code: 200, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async fetchSpecificProrertyBaseOnUserInquery(id) {
    try {
      const inqueryInfo = await Inquirie.findOne({ userId: id });
      if (inqueryInfo && inqueryInfo['_id']) {
        const {
          driveInDoors,
          heavyPower,
          highCeilings,
          standingBuilding,
          workingWithAnotherBroker,
          parkingSpots,
          slidingDoor,
          budgets,
          squareFeet,
        } = inqueryInfo;
        try {
          const data = await propertyModal
            .find({
              $and: [{status: ['Active']}],
              $or: [
                { driveInDoors },
                { heavyPower },
                { highCeilings },
                { standingBuilding },
                { workingWithAnotherBroker },
                { parkingSpots },
                { slidingDoor },
                { payment: { $gte: budgets.min, $lte: budgets.max } },
                { squareFeet: { $gte: squareFeet.min, $lte: squareFeet.max } },
              ],
            })
            .populate('propertyType')
            .select(specificData);
            return { status: 'Success', code: 200, message: '', data };
        } catch (err) {
          return { status: 'Error', code: 400, message: '', err };
        }
      } else {
        return await this.fetchSpecificProrerty();
      }
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async fetchPropertiesAdmin(pagination: any, findData: any) {
    // const ids = await propertyModal.find().select('_id')
    // const status = ['Active', 'Pending', 'Declined']
    // const saleType = ['Sell', 'Rent', 'Lease']
    // // // const propertyTypes = ['60812fa306ab40b967b2b2b3', '60812fa306ab40b967b2b29f', '60812fa306ab40b967b2b293', '60812ec695c1913b6816a924', '60815156dd2ef85230eeaec2']
    // for (const i of ids) {
    //   await propertyModal.findByIdAndUpdate(i, { saleType: saleType[Math.floor(Math.random() * 3)] }, { new: true });
    //   console.log('update' , i)
    // }
    try {
      var regexSearch = new RegExp(pagination.search || '', 'i');
      const data = await propertyModal
        .find({
          ...findData, $or: [
            { title: regexSearch },
            { subTitle: regexSearch },
            { 'address.sortAddress': regexSearch },
            { 'address.fullAddress': regexSearch },
            { 'address.city': regexSearch },
            { 'address.landmarks': regexSearch },
            { 'address.pinCode': regexSearch },
            { 'saleType': regexSearch },
            { 'furnishing': regexSearch },
            { 'payment.type': regexSearch },
            { 'payment.currency': regexSearch },
          ]
        })
        .populate('propertyType')
        .select(specificData)
        .limit(pagination.perRowPage * 1)
        .sort({'createdAt': 'descending'})
        .skip((pagination.currentPage - 1) * pagination.perRowPage);
      return { status: 'Success', code: 200, message: '' , pagination, data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async fetchPropertiesCountAdmin(pagination:any, findData:any ) {
    try {
      return await propertyModal.countDocuments(findData);
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchPropertyTypeWiseProperty(param) {
    const PropertyTypes = await PropertyType.find({ isActive: true }).select('name')
    const { search } = param;
    var regexSearch = new RegExp(search || '', 'i');
    try {
      let finalArr:any = []
      for (let PropertyType of PropertyTypes) {
        const data = await propertyModal
          .find({
            propertyType: PropertyType['_id'], status: 'Active',
            $or: [
              { title: regexSearch },
              { subTitle: regexSearch },
              { 'address.sortAddress': regexSearch },
              { 'address.fullAddress': regexSearch },
              { 'address.city': regexSearch },
              { 'address.landmarks': regexSearch },
              { 'address.pinCode': regexSearch },
              { 'saleType': regexSearch },
              { 'furnishing': regexSearch },
              { 'payment.type': regexSearch },
              { 'payment.currency': regexSearch },
            ]
          })
          .limit(4)
          .sort({'views': 'descending'})
          .populate('propertyType')
          .select(specificData);
        const finalData = { PropertyType: PropertyType, data: data }
        if(finalData.data.length > 0) finalArr.push(finalData)
      }
      return { status: 'Success', code: 200, message: '', properties: finalArr };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }


  public async fetchFunnelProperty(inqueryData:any, pagination:any) {
    try {
      const properties = await propertyModal
        .find({
          $and: [
            {propertyType: inqueryData.propertyType},
            {status: ['Active']},
          ],
          $or: [
            { parkingSpots: { $lte: inqueryData.parkingSpots } },
            { workingWithAnotherBroker: inqueryData.workingWithAnotherBroker },
            { highCeilings: inqueryData.highCeilings },
            { heavyPower: inqueryData.heavyPower },
            { driveInDoors: inqueryData.driveInDoors },
            { standingBuilding: inqueryData.standingBuilding },
            { payment: { $gte: inqueryData.min, $lte: inqueryData.max } },
            { squareFeet: { $gte: inqueryData.min, $lte: inqueryData.max } },
            { saleType: inqueryData.saleType },
          ],
        })
        .populate('propertyType')
        .select(`${specificData}`)
        .sort({'views': 'descending'})
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage);

      if (properties.length > 0) {
        return { status: 'Success', code: 200, message: '' , pagination, properties };
      } else {
        const { data } = await this.fetchRecentUpdatedProperty()
        return { status: 'Success', code: 200, message: '' , pagination: null, properties: data };
      }

    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async fetchfetchFunnelPropertyCount(inqueryData:any) {
    try {
      return await propertyModal.countDocuments({
        $and: [
          { propertyType: inqueryData.propertyType },
          {status: ['Active']},
        ],
        $or: [
          { parkingSpots: { $lte: inqueryData.parkingSpots } },
          { workingWithAnotherBroker: inqueryData.workingWithAnotherBroker },
          { highCeilings: inqueryData.highCeilings },
          { heavyPower: inqueryData.heavyPower },
          { driveInDoors: inqueryData.driveInDoors },
          { standingBuilding: inqueryData.standingBuilding },
          { payment: { $gte: inqueryData.min, $lte: inqueryData.max } },
          { squareFeet: { $gte: inqueryData.min, $lte: inqueryData.max } },
          {saleType: inqueryData.saleType},
        ],
      }).sort({'views': 'descending'});
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchRecentUpdatedProperty() {
    try {
      const data = await propertyModal.find().sort({'createdAt': 'descending'}).limit(10).select(specificData);
      return { status: 'Success', code: 200, message: '', data: data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }

  public async fetchCountStatusWise(status) {
    try {
      return await propertyModal.countDocuments(status);
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchBrokerPropertyStatus(_id) {
    try {
      return await propertyModal.find({seller: _id}).select('status');
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchAdminPropertyStatus() {
    try {
      return await propertyModal.find().select('status');
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async fetchPropertyBaseOnPropertyTypes(find) {
    try {
      return await propertyModal.countDocuments(find)
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }

  public async search(_id) {
    propertyModal.fuzzySearch("off", function(err, users) {
      console.error(err);
      console.log(users);
    });
  }
}
