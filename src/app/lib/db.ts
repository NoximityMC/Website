import mysql from "mysql2/promise";
import { ResultSetHeader, RowDataPacket } from "mysql2"

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : '3306'),
	database: process.env.DB_DATABASE,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
});

async function SelectQuery(query: string, values?: any[]): Promise<RowDataPacket[]> {
	const [results] = await pool.execute(query, values);
	return results as RowDataPacket[];
}

async function ModifyQuery(query: string, values?: any[]): Promise<ResultSetHeader> {
	const [results] = await pool.execute(query, values);
	return results as ResultSetHeader;
}

export const db = {
	users: {
		get: {
			fromId: async (id: number | string) => {
				const results = await SelectQuery('SELECT * FROM users WHERE id = ?', [id])
				if (results.length > 0) {
					return results[0];
				}
				return null;
			},
			fromEmail: async (email: string) => {
				const results = await SelectQuery('SELECT * FROM users WHERE email = ?', [email])
				if (results.length > 0) {
					return results[0];
				}
				return null;
			}
		},
		email: {
			exists: async (email: string): Promise<boolean> => {
				const results = await SelectQuery('SELECT email FROM users WHERE email = ?', [email])
				if (results.length > 0) {
					return true;
				}
				return false;
			},
			fromId: async (id: number | string): Promise<String | null> => {
				const results = await SelectQuery('SELECT email FROM users WHERE id = ?', [id])
				if (results.length > 0) {
					return results[0].email;
				}
				return null;
			},
			getId: async (email: string): Promise<String | number | null> => {
				const results = await SelectQuery('SELECT id FROM users WHERE email = ?', [email])
				if (results.length > 0) {
					return results[0].id;
				}
				return null;
			},
			confirm: async (id: number | string): Promise<boolean> => {
				const results = await ModifyQuery('UPDATE users SET verifiedEmail = ? WHERE id = ?', [1, id])
				if (results.affectedRows > 0) {
					return true;
				}
				return false;
			}
		},
		profile: {
			get: {
				username: async (username: string): Promise<{
					uuid: string;
					username: string;
				} | null> => {
					const results = await SelectQuery('SELECT uuid, username FROM users WHERE username = ?', [username])
					if (results.length > 0) {
						return results[0] as {uuid:string; username: string;};
					}
					return null;
				}
			}
		},
		create: async (uuid: string, username: string, email: string, password: string): Promise<[boolean, number]> => {
			const results = await ModifyQuery('INSERT INTO users (uuid, username, email, password) VALUES(?, ?, ?, ?)', [uuid, username, email, password])
			if (results.affectedRows > 0) {
				return [true, results.insertId]
			}
			return [false, 0]
		},
		discord: {
			set: async (email: string, discordId: string | number): Promise<boolean> => {
				const results = await ModifyQuery('UPDATE users SET discordId = ? WHERE email = ?', [discordId, email])
				if (results.affectedRows > 0) {
					return true
				}
				return false
			},
			get: async (email: string): Promise<string | null> => {
				const results = await SelectQuery('SELECT discordId FROM users WHERE email = ?', [email])
				if (results.length > 0) {
					return results[0].discordId
				}
				return null;
			}
		}
	},
	api: {
		exists: async (key: string): Promise<boolean> => {
			const results = await SelectQuery('SELECT * FROM api_keys WHERE `key` = ?', [key])
			if (results.length > 0) {
				return true;
			}
			return false;
		}
	},
	news: {
		getAll: async () => {
			return await SelectQuery('SELECT * FROM news ORDER BY `createdAt` DESC')
		}
	}
}