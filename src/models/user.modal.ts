import { userStatusEnum, userRoleEnum } from './../enum/user.enum';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangeDate: {
      type: Date,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: userRoleEnum,
    },
    status: {
      required: false,
      type: String,
      enum: userStatusEnum,
    },
    invalidloginAttempts: {
      type: Number,
      required: false,
    },
    invalidLoginDatetime: {
      type: Date,
      required: false,
    },
    otp: {
      type: Number,
      required: true,
    },
    otpGenTime: {
      type: Date,
      required: false,
    },
    address: {
      required: false,
      type: String,
      default: ''
    },
    emergencyContact: {
      required: false,
      type: String,
      default: ''
    },
    imageUrl: {
      required: false,
      type: String,
      default: ''
    },
    gender: {
      required: false,
      enum: ['Male', 'Female', 'Others'],
      type: String
    },
    bio: {
      required: false,
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
