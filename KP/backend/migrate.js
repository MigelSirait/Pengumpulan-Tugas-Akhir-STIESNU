import fs from 'node:fs/promises'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function runMigration() {
  const sqlFile = new URL('./kp_database.sql', import.meta.url)
  const sql = await fs.readFile(sqlFile, 'utf8')
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  })

  try {
    console.log('Menjalankan migrasi database...')
    await connection.query(sql)
    console.log('Migrasi berhasil. Database dan tabel telah dibuat.')
  } catch (error) {
    console.error('Gagal menjalankan migrasi:', error.message)
    process.exitCode = 1
  } finally {
    await connection.end()
  }
}

runMigration().catch((error) => {
  console.error('Error migrasi:', error.message)
  process.exitCode = 1
})
