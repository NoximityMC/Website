import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2"

export async function query(query: string, values:any[] = []) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : '3306'),
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    });

    try {
        const [results] = await connection.execute(query, values);
        connection.end();
        return results as RowDataPacket[];
    } catch (e: any) {
        throw Error(e);
    }
}