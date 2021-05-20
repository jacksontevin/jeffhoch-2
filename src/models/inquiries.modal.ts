import { userRoleEnum } from './../enum/user.enum';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InquirieSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    squareFeet: {
      min: { type: String },
      max: { type: String },
    },
    propertyType: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'PropertyType',
    },
    saleType: {
      type: String,
      default: 'Buy'
    },
    standingBuilding: {
      type: Boolean,
      required: false,
    },
    officeSize: {
      type: String,
    },
    whyOfficeUse: {
      type: String,
    },
    driveInDoors: {
      type: Boolean,
      required: false,
    },
    heavyPower: {
      required: false,
      type: Boolean,
    },
    highCeilings: {
      type: Boolean,
      required: false,
    },
    slidingDoor: {
      type: Boolean,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['Lease', 'Buy'],
    },
    budgets: {
      min: { type: String },
      max: { type: String },
    },
    parkingSpots: {
      type: Number,
    },
    workingWithAnotherBroker: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: userRoleEnum,
    },
    gender: {
      required: false,
      enum: ['Male', 'Female'],
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Inquirie', InquirieSchema);
