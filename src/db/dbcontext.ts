import { DataSource } from 'typeorm';

export const dbcontext = new DataSource({
	type: 'mariadb',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 3306,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false,
	synchronize: true,
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
});
