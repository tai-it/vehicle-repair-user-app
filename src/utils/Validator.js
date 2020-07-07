export const isValidPassword = password => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
}

export const isValidPhoneNumber = phoneNumber => {
  return /\b([0-9]{10})\b/.test(phoneNumber)
}