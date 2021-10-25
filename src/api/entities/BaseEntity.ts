import {BaseEntity as CoreBaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn} from "typeorm";

abstract class BaseEntity extends CoreBaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default BaseEntity;
