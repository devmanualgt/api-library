import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1726726523063 implements MigrationInterface {
  name = 'Migrations1726726523063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('CLIENT', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "age" integer, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "author" character varying NOT NULL, "isbn" character varying NOT NULL, "publish_year" integer NOT NULL, "copies" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "link_img" character varying NOT NULL DEFAULT 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png', "topics" character varying NOT NULL, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "loans" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "return_date" TIMESTAMP, "loan_terminate" boolean NOT NULL DEFAULT false, "user_id" integer, "book_id" integer, CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "loans" ADD CONSTRAINT "FK_d135791c39e46e13ca4c2725fbb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loans" ADD CONSTRAINT "FK_09b09d3d1b8e33c0f8dd4cafa48" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loans" DROP CONSTRAINT "FK_09b09d3d1b8e33c0f8dd4cafa48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loans" DROP CONSTRAINT "FK_d135791c39e46e13ca4c2725fbb"`,
    );
    await queryRunner.query(`DROP TABLE "loans"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
