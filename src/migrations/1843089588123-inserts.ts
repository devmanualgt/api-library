import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetValues1843089588123 implements MigrationInterface {
  name = 'SetValues1843089588123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (first_name, last_name, age, email, username, password, role)
      VALUES 
        ('Admin', 'User', 0, 'admin@umg.com', 'admin', '$2b$10$tjGsPta4oCqUCQunis5k8.uPNJUG3S.igCpR6zhYj4j0BeYAIE8Jq', 'ADMIN'),
        ('Denis', 'Ixcajoc', 0, 'dixcajoc@umg.com', 'denis', '$2b$10$tjGsPta4oCqUCQunis5k8.uPNJUG3S.igCpR6zhYj4j0BeYAIE8Jq', 'CLIENT');
    `);

    await queryRunner.query(`
      INSERT INTO book (title, author, isbn, publish_year, copies, quantity, topics, link_img)
      VALUES
        ('El hombre que amaba a los perros', 'Leonardo Padura', '9788420425980', 2009, 5, 5, 'Ficción, Novela histórica', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('El sueño del celta', 'Mario Vargas Llosa', '9788432212896', 2010, 3, 3, 'Ficción, Novela histórica', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('La mujer en la ventana', 'A.J. Finn', '9788490620354', 2018, 10, 10, 'Thriller, Misterio', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('Cuentos de la selva', 'Horacio Quiroga', '9789871134340', 1918, 8, 8, 'Cuentos, Literatura infantil', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('El caballero de la armadura oxidada', 'Robert Fisher', '9788478888550', 1998, 7, 7, 'Autoayuda, Ficción', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('La fiesta del chivo', 'Mario Vargas Llosa', '9788497593272', 2000, 6, 6, 'Ficción, Novela histórica', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('Las aventuras de Pinocho', 'Carlo Collodi', '9788497950167', 1883, 12, 12, 'Cuentos, Literatura infantil', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('La tregua', 'Mario Benedetti', '9789871134371', 1960, 9, 9, 'Ficción, Novela', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('Don Quijote de la Mancha', 'Miguel de Cervantes', '9788491050810', 1605, 4, 4, 'Clásico, Novela', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png'),
        ('El Aleph', 'Jorge Luis Borges', '9788432214090', 1949, 5, 5, 'Ficción, Cuentos', 'https://myprecargas.s3.amazonaws.com/banners/20240906T003033787.png');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE username = 'admin';
    `);

    // O puedes eliminar todos los registros si es necesario
    await queryRunner.query(`
      DELETE FROM book WHERE title IN (
        'El hombre que amaba a los perros',
        'El sueño del celta',
        'La mujer en la ventana',
        'Cuentos de la selva',
        'El caballero de la armadura oxidada',
        'La fiesta del chivo',
        'Las aventuras de Pinocho',
        'La tregua',
        'Don Quijote de la Mancha',
        'El Aleph'
      );
    `);
  }
}
