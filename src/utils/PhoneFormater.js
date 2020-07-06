export default class PhoneFormater {
  static normalize(phoneNumber) {
    try {
      phoneNumber = phoneNumber.toString()
      if (phoneNumber.length === 10) {
        return phoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, "(+84) $2 $3 $4")
      }
      return phoneNumber.replace(/(\d{1})(\d{3})(\d{4})(\d{3})/, "(+84) $2 $3 $4")
    } catch (e) {
      console.log(e)
    }
  }
}