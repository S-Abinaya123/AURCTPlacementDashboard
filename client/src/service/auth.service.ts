import publicAxios from "../api/publicAxios";
import authAxios from "../api/authAxios";

type signupDataType = {
    userName: string,
    email: string,
    password: string,
    otp: number
}

type LoginDataType =
  | {
      mobileNo: string;
      password: string;
      role: string;
    }
  | {
      registerNo: string;
      password: string;
      role: string;
    };

type getOtpType = {
    userName: string,
    email: string
}

type resetRequestType = getOtpType;

type updatePasswordType = {
    email: string,
    resetToken: string,
    newPassword: string
}

export const authService = {
    login: (data: LoginDataType) => publicAxios.post('/api/auth/login', data),
    verifyToken: () => authAxios.get('/api/auth/verify-token'),


    signup: (data: signupDataType) => publicAxios.post('/api/auth/createuser', data),
    getOtp: (data: getOtpType) => publicAxios.post('/api/auth/getotp', data),
    resetRequest: (data: resetRequestType) => publicAxios.post('/api/auth/resetrequest', data),
    updatePassword: (data: updatePasswordType) => publicAxios.put('/api/auth/update-password', data),
}