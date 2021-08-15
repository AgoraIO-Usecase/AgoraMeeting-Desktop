import AgoraMeetingSDK from 'agora-meeting-sdk'
import { RtmTokenBuilder, RtmRole } from 'agora-access-token'
import MD5 from 'js-md5'

//  Please enter your appId
const appId = '<YOUR APP_ID> '
//  Please enter your appCertificate
const appCertificate = '<YOUR APP_CERTIFICATE>'

//  Please enter any userName
const userName = 'user'
const userId = MD5(userName)

// Please enter any roomName
const roomName = '123456qwa'
const roomId = MD5(roomName)

const token = RtmTokenBuilder.buildToken(
  appId,
  appCertificate,
  userId,
  RtmRole.Rtm_User,
  0
)

export default class App {
  constructor(elem) {
    if (!elem) return
    this.elem = elem
  }
  setupMeeting() {
    AgoraMeetingSDK.init({
      appId: appId,
    })
    AgoraMeetingSDK.launch(document.querySelector(`#${this.elem.id}`), {
      token: token,
      userName: userName,
      userId: userId,
      roomName: roomName,
      roomId: roomId,
      roomPassword: '',
      pretest: true,
      duration: 2700,
      maxPeople: 1000,
      openCamera: true,
      openMic: true,
      userInOutNotificationLimitCount: 50,
      recordUrl: '<Your Record Page Url>',
      listener: (evt) => {
        console.log('evt', evt)
      },
    })
  }
}
