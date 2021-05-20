import { User } from './../models/index';

export default class AuthService {
  public async register(payload: any) {
    try {
      return await User.create(payload);
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err };
    }
  }
  public async fetchUserById(_id: any) {
    try {
      const data = await User.findOne({ _id });
      return { status: 'Success', code: 200, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async fetchUserByEmail(email: any) {
    try {
      const data = await User.findOne({ email: email });
      if (data['_id']) return { status: 'Success', code: 200, message: '', data };
      else return { status: 'Success', code: 404, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async fetchUserByMobile(mobile: any) {
    try {
      const data = await User.findOne({ mobile: mobile });
      if (data['_id']) return { status: 'Success', code: 200, message: '', data };
      else return { status: 'Success', code: 404, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async accountVerify(_id: any) {
    try {
      const data = await User.findByIdAndUpdate(_id, { status: 'ACTIVE', otp: null, otpGenTime: null }, { new: true });
      if (data['_id']) return { status: 'Success', code: 200, message: '', data };
      else return { status: 'Success', code: 404, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async editUser(_id: any, payload: any) {
    try {
      const data = await User.findByIdAndUpdate(_id, payload, { new: true });
      if (data['_id']) return { status: 'Success', code: 200, message: '', data };
      else return { status: 'Success', code: 404, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
  public async inqueryStatusChange(payload: any) {
    try {
      const data = await User.findByIdAndUpdate(payload.userId, payload, { new: true });
      if (data['_id']) return { status: 'Success', code: 200, message: '', data };
      else return { status: 'Success', code: 404, message: '', data };
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err };
    }
  }
}
