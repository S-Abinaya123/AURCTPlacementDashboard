export const isValidRegisterNo = (value: string) => {
  return /^\d{12}$/.test(value);
};

export const isValidMobileNo = (value: string) => {
  return /^\d{10}$/.test(value);
};