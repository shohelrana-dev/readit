import {check} from "express-validator";
import {getRepository} from "typeorm";
import Sub from "../entities/Sub";

class SubsValidation {

    create(): any {
        return [
            check('name').trim().isLength({min: 1}).withMessage('Name is not be empty!')
                .custom(SubsValidation.checkSubNotExists),
            check('title').trim().isLength({min: 1}).withMessage('Title is not be empty!'),
        ]
    }

    private static async checkSubNotExists(name: string): Promise<any> {
        const sub = await getRepository(Sub).createQueryBuilder('sub')
            .where('lower(sub.name)=:name', {name: name.toLowerCase()})
            .getOne();
        if (sub) throw new Error('Sub exists already!');
    }
}

export default new SubsValidation();