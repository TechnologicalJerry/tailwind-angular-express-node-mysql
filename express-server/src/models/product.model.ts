import { customAlphabet } from "nanoid";
import { db } from "../utils/connect";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface ProductInput {
  user_id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductDocument extends ProductInput {
  id: number;
  product_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductRow extends RowDataPacket, ProductDocument {}

export class ProductModel {
  static async create(input: ProductInput): Promise<ProductDocument> {
    const productId = `product_${nanoid()}`;

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO products (product_id, user_id, title, description, price, image) VALUES (?, ?, ?, ?, ?, ?)",
      [productId, input.user_id, input.title, input.description, input.price, input.image]
    );

    const [rows] = await db.execute<ProductRow[]>(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    return rows[0];
  }

  static async findOne(
    query: Partial<ProductDocument>,
    options: { lean?: boolean } = {}
  ): Promise<ProductDocument | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (conditions.length === 0) return null;

    const [rows] = await db.execute<ProductRow[]>(
      `SELECT * FROM products WHERE ${conditions.join(" AND ")} LIMIT 1`,
      values
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async findOneAndUpdate(
    query: Partial<ProductDocument>,
    update: Partial<ProductDocument>,
    options: { new?: boolean } = {}
  ): Promise<ProductDocument | null> {
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
      if (value !== undefined && key !== "id") {
        setters.push(`${key} = ?`);
        setterValues.push(value);
      }
    });

    if (conditions.length === 0 || setters.length === 0) return null;

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE products SET ${setters.join(", ")} WHERE ${conditions.join(" AND ")}`,
      [...setterValues, ...conditionValues]
    );

    if (result.affectedRows === 0) return null;

    // Return the updated document if requested
    if (options.new) {
      return this.findOne(query);
    }

    return null;
  }

  static async deleteOne(query: Partial<ProductDocument>): Promise<{ deletedCount: number }> {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (conditions.length === 0) return { deletedCount: 0 };

    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM products WHERE ${conditions.join(" AND ")}`,
      values
    );

    return { deletedCount: result.affectedRows };
  }
}

export default ProductModel;
