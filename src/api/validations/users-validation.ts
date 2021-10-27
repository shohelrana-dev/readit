import {check} from "express-validator";
import User from "../entities/User";
import bcrypt from "bcrypt";

class UsersValidation {

    public signup(): any[] {
        return [
            check('username').trim().isLength({min: 1}).withMessage('Username field is required!')
                .custom(UsersValidation.checkUsernameNotExists),
            check('email').trim().isLength({min: 1}).withMessage('Email field is required!')
                .isEmail().withMessage('Email address is not valid').custom(UsersValidation.checkEmailNotExists),
            check('password').trim().isLength({min: 1}).withMessage('Password field is required!')
                .isLength({min: 4}).withMessage('Password should be min 4 characters!'),
        ]
    }

    public login(): any[] {
        return [
            check('username').trim().isLength({min: 1}).withMessage('Username field is required!')
                .custom(UsersValidation.checkUsernameExists),
            check('password').trim().isLength({min: 1}).withMessage('Password field is required!')
                .custom(UsersValidation.checkValidPassword),
        ];
    }

    private static async checkUsernameNotExists(username: string) {
        let user = await User.findOne({username});
        if (user) {
            throw new Error('Username already exists!')
        }
    }

    private static async checkEmailNotExists(email: string) {
        let user = await User.findOne({email});
        if (user) {
            throw new Error('Email address already exists!')
        }
    }

    private static async checkUsernameExists(username: string) {
        let user = await User.findOne({username});
        if (!user) {
            throw new Error('Username not match!');
        }
    }

    private static async checkValidPassword(_: any, {req}: any): Promise<any> {
        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        if (user) {
            let isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                return true;
            }
            throw new Error('Password is incorrect!');
        }
    }
}

export default new UsersValidation();