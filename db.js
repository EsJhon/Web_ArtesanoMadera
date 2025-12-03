import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,      // se conecta al host de Railway
  user: process.env.DB_USER,      // usuario de la base
  password: process.env.DB_PASSWORD, // contraseña
  database: process.env.DB_NAME,  // nombre de la BD
});
