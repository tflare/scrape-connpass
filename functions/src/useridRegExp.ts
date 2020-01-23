export class UseridRegExp {
  open: RegExp;
  presentation: RegExp;
  attendance: RegExp;
  
  constructor() {
    // 管理者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/open/">
    this.open = /^https:\/\/connpass.com\/user\/(.*?)\/open\/$/; 
    // 発表者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/presentation/">
    this.presentation = /^https:\/\/connpass.com\/user\/(.*?)\/presentation\/$/;
    // 参加者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/">
    this.attendance = /^https:\/\/connpass.com\/user\/(.*?)\/$/;
  }
}
