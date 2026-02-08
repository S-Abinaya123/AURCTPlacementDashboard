import { response } from '../utils/response.js';
import { loginUserService } from '../service/authService.js';

export const loginUser = async (req, res) => {
    const result = await loginUserService(req.body);
    if(result.status === 200) {
        return res.status(200).send(response('SUCCESS', result.message, result.data));
    }
    else {
        return res.status(result.status).send(response('FAILED', result.message ));
    }
}

export const verifyTokenController = async (req, res) => {
    return res.status(200).json({ valid: true, user: req.user });
}