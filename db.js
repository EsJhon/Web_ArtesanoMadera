import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'web_artesano',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
export async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Conectado a MySQL en Railway');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    console.log('🔍 Variables disponibles:', {
      MYSQLHOST: process.env.MYSQLHOST,
      MYSQLUSER: process.env.MYSQLUSER,
      MYSQLDATABASE: process.env.MYSQLDATABASE,
      MYSQLPORT: process.env.MYSQLPORT
    });
    return false;
  }
}