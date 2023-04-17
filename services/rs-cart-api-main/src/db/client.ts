import { Pool } from 'pg'

let pool: Pool;

export const connection = () => {
  if (pool) return pool;

  pool = new Pool({
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    max: 20,
  })

  return pool;
}