import { AgoraMeetingSDK } from "agora-meeting-sdk";
import { RtmTokenBuilder, RtmRole } from "agora-access-token";

//  Please enter your appId
const appId = "<YOUR APPID>";
//  Please enter your appCertificate
const appCertificate = "<YOUR APPCERTIFICATE>";

const userId = "test";

const token = RtmTokenBuilder.buildToken(appId, appCertificate, userId, RtmRole.Rtm_User, 0);

export default class App {
  constructor(elem) {
    if (!elem) return;
    this.elem = elem;
  }
  setupMetting() {
    AgoraMeetingSDK.init({
      appId: appId,
    });
    AgoraMeetingSDK.launch(document.querySelector(`#${this.elem.id}`), {
      token: token,
      userId: userId,
      userName: "any",
      roomId: "12345",
      roomName: "demo",
      roomPassword: "",
      pretest: true,
      duration: 2700,
      maxPeople: 1000,
      openCamera: true,
      openMic: true,
      userInOutNotificationLimitCount: 50,
      recordUrl: "<Your Record Page Url>",
      listener: (evt) => {
        console.log("evt", evt);
      },
    });
  }
}
