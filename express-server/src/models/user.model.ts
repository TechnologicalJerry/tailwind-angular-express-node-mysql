import bcrypt from "bcrypt";
import config from "config";
import { db } from "../utils/connect";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends UserInput {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserRow extends RowDataPacket, UserDocument {}

export class UserModel {
  static async create(input: UserInput): Promise<UserDocument> {
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hashedPassword = await bcrypt.hash(input.password, salt);

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
      [input.email, input.name, hashedPassword]
    );

    const [rows] = await db.execute<UserRow[]>(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );

    return rows[0];
  }

  static async findOne(query: Partial<UserDocument>): Promise<UserDocument | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (conditions.length === 0) return null;

    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE ${conditions.join(" AND ")} LIMIT 1`,
      values
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id: number): Promise<UserDocument | null> {
    const [rows] = await db.execute<UserRow[]>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (e) {
      return false;
    }
  }
}

export default UserModel;
