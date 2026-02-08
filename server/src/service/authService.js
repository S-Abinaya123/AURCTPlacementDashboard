import User from "../models/userModels.js";
import bcrypt from 'bcrypt';
import { generateJwtToken } from "../utils/jwtToken.js";

export const loginUserService = async (loginCredentials) => {
    try {
        const { role } = loginCredentials;

        if(role == 'STUDENT') {
            const { registerNo, password } = loginCredentials;
            const student = User.findOne({ registerNo }).exec();
            if(!student) {
                return { status: 401, message: 'Invalid register number or password.' };
            }
            else if(!student.password) {
                return { status: 403, message: 'Account not created yet.' };
            }

            const isPasswordCorrect = await bcrypt.compare(password, student.password);
            if (isPasswordCorrect) {
                return {status: 200, message: 'Loggedin successfully.', userId: student._id};
            }
            else {
                return { status: 401, message: 'Invalid register number or password.' };
            }
        }
        else {
            const { mobileNo, password } = loginCredentials;
            const faculty = await User.findOne({ mobileNo }).exec();
            if(!faculty) {
                return { status: 401, message: 'Invalid mobile number or password.' };
            }
            
            const isPasswordCorrect = await bcrypt.compare(password, faculty.password);
            if (isPasswordCorrect) {
                return {status: 200, message: 'Loggedin successfully.', data:{userId: faculty._id, token: generateJwtToken({userId: faculty._id}, '180d'), userName: faculty.userName, profilePicture: faculty.profilePicture || '', role: faculty.role}};
            }
            else {
                return { status: 401, message: 'Invalid mobile number or password.' };
            }
        }
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}