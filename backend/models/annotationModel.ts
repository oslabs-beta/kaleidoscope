import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const PG_URI: string | undefined = process.env.PG_URI;

const pool = new Pool({
    connectionString: PG_URI,
});

pool.on('connect', () => {
    console.log('connected to the database!');
});

export const query = (text: string, params: any[] | undefined, callback) => {
    console.log('executed query', text);
    pool.query(text, params, callback);
};

export default {
    query,
};
