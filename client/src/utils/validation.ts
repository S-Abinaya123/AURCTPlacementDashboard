export const isValidRegisterNo = (value: string) => {
  return /^\d{12}$/.test(value);
};