import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1725595402615 implements MigrationInterface {
  name = 'Init1725595402615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`age\` int NULL, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('CLIENT', 'ADMIN') NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`loans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`return_date\` timestamp NULL, \`loan_terminate\` tinyint NOT NULL DEFAULT 0, \`user_id\` int NULL, \`book_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`book\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, \`isbn\` varchar(255) NOT NULL, \`publish_year\` int NOT NULL, \`copies\` int NOT NULL, \`quantity\` int NOT NULL DEFAULT '0', \`link_img\` varchar(255) NOT NULL DEFAULT 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png', \`topics\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_d135791c39e46e13ca4c2725fbb\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_09b09d3d1b8e33c0f8dd4cafa48\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_09b09d3d1b8e33c0f8dd4cafa48\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_d135791c39e46e13ca4c2725fbb\``,
    );
    await queryRunner.query(`DROP TABLE \`book\``);
    await queryRunner.query(`DROP TABLE \`loans\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
