import publicAxios from "../api/publicAxios";
import authAxios from "../api/authAxios";

type signupDataType = {
    userName: string,
    email: string,
    password: string,
    otp: number
}

type loginDataType = {
    userName: string,
    password: string
}

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

export const AuthService = {
    signup: (data: signupDataType) => publicAxios.post('/api/auth/createuser', data),
    login: (data: loginDataType) => publicAxios.post('/api/auth/loginuser', data),
    getOtp: (data: getOtpType) => publicAxios.post('/api/auth/getotp', data),
    resetRequest: (data: resetRequestType) => publicAxios.post('/api/auth/resetrequest', data),
    updatePassword: (data: updatePasswordType) => publicAxios.put('/api/auth/update-password', data),
    verifyToken: () => authAxios.get('/api/auth/verifytoken')
}