import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetValues1843089588123 implements MigrationInterface {
  name = 'SetValues1843089588123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "users" ("first_name", "last_name", "age", "email", "username", "password", "role")
            VALUES ('Admin', 'User', 0, 'admin@umg.com', 'admin', '$2b$10$tjGsPta4oCqUCQunis5k8.uPNJUG3S.igCpR6zhYj4j0BeYAIE8Jq', 'ADMIN');
        `);

    await queryRunner.query(`
          INSERT INTO "book" ("title", "author", "isbn", "publish_year", "copies", "quantity", "topics")
          VALUES
          ('El hombre que amaba a los perros', 'Leonardo Padura', '9788420425980', 2009, 5, 5, 'Ficción, Novela histórica'),
          ('El sueño del celta', 'Mario Vargas Llosa', '9788432212896', 2010, 3, 3, 'Ficción, Novela histórica'),
          ('La mujer en la ventana', 'A.J. Finn', '9788490620354', 2018, 10, 10, 'Thriller, Misterio'),
          ('Cuentos de la selva', 'Horacio Quiroga', '9789871134340', 1918, 8, 8, 'Cuentos, Literatura infantil'),
          ('El caballero de la armadura oxidada', 'Robert Fisher', '9788478888550', 1998, 7, 7, 'Autoayuda, Ficción'),
          ('La fiesta del chivo', 'Mario Vargas Llosa', '9788497593272', 2000, 6, 6, 'Ficción, Novela histórica'),
          ('Las aventuras de Pinocho', 'Carlo Collodi', '9788497950167', 1883, 12, 12, 'Cuentos, Literatura infantil'),
          ('La tregua', 'Mario Benedetti', '9789871134371', 1960, 9, 9, 'Ficción, Novela'),
          ('Don Quijote de la Mancha', 'Miguel de Cervantes', '9788491050810', 1605, 4, 4, 'Clásico, Novela'),
          ('El Aleph', 'Jorge Luis Borges', '9788432214090', 1949, 5, 5, 'Ficción, Cuentos')
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "users" WHERE "username" = 'admin';
        `);
  }
}
