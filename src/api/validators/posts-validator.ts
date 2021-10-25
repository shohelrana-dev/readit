import {check} from "express-validator";
import {getRepository} from "typeorm";
import Sub from "../entities/Sub";

class PostsValidator {

    create(): any {
        return [
            check('title').trim().isLength({min: 1}).withMessage('Title is not be empty!'),
            check('body').trim().isLength({min: 1}).withMessage('Body is not be empty!'),
            check('sub').trim().isLength({min: 1}).withMessage('Subject is not be empty!')
                .custom(PostsValidator.checkSubExists),
        ]
    }

    private static async checkSubExists(subName: string): Promise<any> {
        const sub = await getRepository(Sub).createQueryBuilder('sub')
            .where('lower(sub.name)=:name', {name: subName.toLowerCase()})
            .getOne();
        if (sub) return true;

        throw new Error('Sub is not exists!');
    }
}

export default new PostsValidator();