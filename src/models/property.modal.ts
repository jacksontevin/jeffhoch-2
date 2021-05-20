import { propertyStatus } from './../enum/enum';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      required: false,
      defualt: true,
    },
    status: {
      type: String,
      required: false,
      enum: propertyStatus,
      defualt: 'Pending',
    },
    statusChangeDate: {
      type: Date,
      required: false,
      defualt: null
    },
    isApprove: {
      type: Boolean,
      defualt: false,
      required: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    documents: [
      {
        name: { type: String },
        fileLocation: { type: String },
        fileKey: { type: String },
        fileName: { type: String }
      }
    ],
    address: {
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
      sortAddress: { type: String, required: true },
      fullAddress: { type: String, required: true },
      pinCode: { type: String, required: true },
      attractions: [{ type: String }],
      landmarks: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    facilities: { type: String, required: true },
    description: { type: String, required: true },
    buildingAge: { type: Number, required: true },
    images: [{ type: String }],
    services: [{ type: String }],
    // videos: [{ type: String }],
    amenities: [{ type: String }],
    propertyType: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'PropertyType',
    },
    subPropertyType: [{ type: Schema.Types.ObjectId, ref: 'SubPropertyType' }],
    payment: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: false,
        enum: ['Yearly', 'Monthly', 'Half Yearly'],
      },
    },
    constructionStatus: {
      required: true,
      type: String,
      enum: ['Ready to Move', 'Under Construction'],
    },
    saleType: {
      required: true,
      type: String,
      enum: ['Sell', 'Rent', 'Buy', 'Lease'],
    },
    coveredArea: {
      type: { type: String, required: false, },
      min: { type: String, required: false, },
      max: { type: String, required: false, },
    },
    ownership: {
      type: String,
      required: false,
      enum: ['Freehold', 'Leasehold', 'Power Of Attorney', 'Co-operative Society'],
    },
    bathroom: { type: Number, required: false, },
    totalRoom: { type: Number, required: false, },
    furnishing: {
      type: String,
      required: false,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    },
    facing: {
      type: String,
      required: false,
      enum: ['East', 'North', 'North - East', 'North - West', 'South', 'South - East'],
    },
    floor: { type: Number, required: false, },
    squareFeet: {
      type: { type: String, required: false, },
      min: { type: String, required: false, },
      max: { type: String, required: false, },
    },
    parkingSpots: {
      type: Number,
      required: false,
    },
    workingWithAnotherBroker: {
      type: Boolean,
      required: false,
    },
    driveInDoors: {
      type: Boolean,
      required: false,
    },
    heavyPower: {
      type: Boolean,
      required: false,
    },
    highCeilings: {
      type: Boolean,
      required: false,
    },
    slidingDoor: {
      type: Boolean,
      required: false,
    },
    standingBuilding: {
      type: Boolean,
      required: false,
    },
    views: {
      type: Number,
      required: false,
    },
    keywork: [{ type: String }],
    declineNote: {
      required: false,
      default: '',
      type: String
    }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('Property', PropertySchema);

// contactInformation: {
    //   name: {
    //     type: String,
    //     required: false,
    //   },
    //   email: {
    //     type: String,
    //     required: false,
    //   },
    //   address: {
    //     type: String,
    //     required: false,
    //   },
    //   phone: {
    //     type: String,
    //     required: false,
    //   },
    //   alternetPhone: {
    //     type: String,
    //     required: false,
    //   },
    //   conversationTime: {
    //     type: String,
    //     required: false,
    //   },
    // },
// dealerDetails: {
    //   name: {
    //     type: String,
    //     required: false,
    //   },
    //   email: {
    //     type: String,
    //     required: false,
    //   },
    //   offceAddrress: {
    //     type: String,
    //     required: false,
    //   },
    // },
    // builderDetails: {
    //   name: {
    //     type: String,
    //     required: false,
    //   },
    //   email: {
    //     type: String,
    //     required: false,
    //   },
    //   offceAddrress: {
    //     type: String,
    //     required: false,
    //   },
    // },
