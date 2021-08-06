import { AgoraMeetingSDK } from "agora-meeting-sdk";

//  Please enter your appId
const appId = "<YOUR APPID>";
//  Please enter your rtm token
const token = "<YOUR RTM TOKEN>";

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
      userId: "test",
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
