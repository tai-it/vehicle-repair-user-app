export default class Validator {
  static validate = (fieldName, value) => {
    if (!value) {
      return {
        status: false,
        message: 'Required'
      }
    } else {
      if (fieldName === 'name') {
        
      }
    }
  }
}