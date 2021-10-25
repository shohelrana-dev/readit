import {MigrationInterface, QueryRunner} from "typeorm";

export class createSubsTable1634474959427 implements MigrationInterface {
    name = 'createSubsTable1634474959427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`imageUrn\` varchar(255) NULL, \`bannerUrn\` varchar(255) NULL, \`username\` varchar(255) NULL, UNIQUE INDEX \`IDX_2ae46b179b70ab8179597adb8c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`subs\` ADD CONSTRAINT \`FK_4520ae7b26f68a13ec3e96dbbba\` FOREIGN KEY (\`username\`) REFERENCES \`users\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_cca21672314ce54982a6dd5d121\` FOREIGN KEY (\`subName\`) REFERENCES \`subs\`(\`name\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_cca21672314ce54982a6dd5d121\``);
        await queryRunner.query(`ALTER TABLE \`subs\` DROP FOREIGN KEY \`FK_4520ae7b26f68a13ec3e96dbbba\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ae46b179b70ab8179597adb8c\` ON \`subs\``);
        await queryRunner.query(`DROP TABLE \`subs\``);
    }

}
