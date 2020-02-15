import { NarrowDown } from './narrowDown';

export class NarrowDownConnpass implements NarrowDown {
  private open: RegExp;
  private presentation: RegExp;
  private attendance: RegExp;
  data: string;
  option: boolean;

  constructor() {
    // 管理者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/open/">
    this.open = /^https:\/\/connpass.com\/user\/([^/]*?)\/open\/$/;
    // 発表者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/presentation/">
    this.presentation = /^https:\/\/connpass.com\/user\/([^/]*?)\/presentation\/$/;
    // 参加者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/">
    this.attendance = /^https:\/\/connpass.com\/user\/([^/]*?)\/$/;

    this.data = "";
    this.option = false; //isPresentationUser
  }

  narrowdown(value: any){

    let regData: string = "";
    regData = this.getUsername(value, this.open);

    if(regData){
      // 管理者には来ない人もいるので、attendanceUserで取得する。
      return false;
    }

    regData = this.getUsername(value, this.presentation)
    if(regData){
      this.data = regData;
      this.option = true;
      return true;
    }

    regData = this.getUsername(value, this.attendance)
    if(regData){
      this.data = regData;
      this.option = false;
      return true;
    }

    // "Unintended behavior to come here"
    console.error("error001:value" + value);
    return false;
  }

  getUsername(url: any, re: RegExp){
    const result =  re.exec(url);
    if(result){
      //console.log("getusername:" + result[1]);
      return result[1];
    }
    return "";
  }
}
