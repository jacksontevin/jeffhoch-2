import { NotificationSchema } from "../models"
var io = null
var socket = null
const REGISTER = {
  USER: 'Welcom To Island ',
  ADMIN: 'New User Register ',
  ADMIN_PATH: '/admin-land/users',
  USER_PATH: '/profile'
}

// New customer test-eb has been registered.

// New vendor nik has been registered.

const VERIFY = {
  USER: 'Your Account Verify Successfully',
  ADMIN: null,
  ADMIN_PATH: null,
  USER_PATH: '/profile'
}

const CONTACT_US = {
  USER: null,
  ADMIN: 'New user inquiry generated',
  ADMIN_PATH: '/admin-land/contacts',
  USER_PATH: null
}

let notificationTypes = <any>[{ REGISTER }, { VERIFY }, { CONTACT_US }]

export const notification = async (user, type) => {
  const data = <any> notificationTypes.find(i => i[type])
  if (data) {
    if (data[type]['USER']) {
      const userPayload = {
        title: `${data[type]['USER']}`,
        isSeen: false,
        userPath: data[type]['USER_PATH'],
        user: user._id,
        type: 0
      }
      await NotificationSchema.create(userPayload)
    }
    if (data[type]['ADMIN']) {
      const adminPayload = {
        title: data[type]['ADMIN'],
        isSeen: false,
        userPath: data[type]['ADMIN_PATH'],
        user: null,
        type: 1
      }
      await NotificationSchema.create(adminPayload)
    }
  }
}

export const adminNotification = async (title, adminPath) => {
  const adminPayload = {
    title: title,
    isSeen: false,
    userPath: '',
    adminPath: adminPath,
    user: null,
    type: 1
  }
  await NotificationSchema.create(adminPayload)
}

export const userNotification = async (title, userId, userPath) => {
  const payload = {
    title: title,
    isSeen: false,
    userPath: userPath,
    adminPath: '',
    user: userId,
    type: 0
  }
  await NotificationSchema.create(payload)
}

export const notificationSocket = (socket, io) => {
  socket.on('onClientMsg', async (messageInfo)  => {
    const { senderId, receiverId, message } = messageInfo
    const payload = {
      senderId,
      receiverId,
      message,
      isSeen: false
    }
    io.emit('onServerMsg', payload);
  })
}
