import { db } from "../utils/connect";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface SessionInput {
  user_id: number;
  valid?: boolean;
  user_agent: string;
}

export interface SessionDocument extends SessionInput {
  id: number;
  valid: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SessionRow extends RowDataPacket, SessionDocument {}

export class SessionModel {
  static async create(input: SessionInput): Promise<SessionDocument> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO sessions (user_id, valid, user_agent) VALUES (?, ?, ?)",
      [input.user_id, input.valid ?? true, input.user_agent]
    );

    const [rows] = await db.execute<SessionRow[]>(
      "SELECT * FROM sessions WHERE id = ?",
      [result.insertId]
    );

    return rows[0];
  }

  static async findOne(query: Partial<SessionDocument>): Promise<SessionDocument | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (conditions.length === 0) return null;

    const [rows] = await db.execute<SessionRow[]>(
      `SELECT * FROM sessions WHERE ${conditions.join(" AND ")} LIMIT 1`,
      values
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id: number): Promise<SessionDocument | null> {
    const [rows] = await db.execute<SessionRow[]>(
      "SELECT * FROM sessions WHERE id = ? LIMIT 1",
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async updateOne(
    query: Partial<SessionDocument>,
    update: Partial<SessionDocument>
  ): Promise<boolean> {
    const conditions: string[] = [];
    const conditionValues: any[] = [];
    const setters: string[] = [];
    const setterValues: any[] = [];

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        conditions.push(`${key} = ?`);
        conditionValues.push(value);
      }
    });

    Object.entries(update).forEach(([key, value]) => {
      if (value !== undefined) {
        setters.push(`${key} = ?`);
        setterValues.push(value);
      }
    });

    if (conditions.length === 0 || setters.length === 0) return false;

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE sessions SET ${setters.join(", ")} WHERE ${conditions.join(" AND ")}`,
      [...setterValues, ...conditionValues]
    );

    return result.affectedRows > 0;
  }
}

export default SessionModel;
