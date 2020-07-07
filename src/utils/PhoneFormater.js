import { isValidPhoneNumber } from "./Validator"

export default class PhoneFormater {

  static normalize(phoneNumber) {
    if (isValidPhoneNumber(phoneNumber)) {
      return phoneNumber.replace(/(\d{1})(\d{9})/, "+84$2")
    }
    return phoneNumber
  }

  static display(phoneNumber) {
    return phoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, "(+84) $2 $3 $4")
  }
}