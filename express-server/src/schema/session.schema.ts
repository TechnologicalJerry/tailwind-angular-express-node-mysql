import { object, string } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     GetSessionResponse:
 *       type: array
 *       items:
 *         type: object
 *         required:
 *           - user_id
 *           - valid
 *           - user_agent
 *           - created_at
 *           - updated_at
 *         properties:
 *           id:
 *             type: number
 *           user_id:
 *             type: number
 *           valid:
 *             type: boolean
 *           user_agent:
 *             type: string
 *           created_at:
 *             type: string
 *           updated_at:
 *             type: string
 *     CreateSessionInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: jane.doe@example.com
 *         password:
 *           type: string
 *           default: stringPassword123
 *     CreateSessionResponse:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 */

export const createSessionSchema = object({
  body: object({
    email: string().email("Not a valid email"),
    password: string().min(1, "Password is required"),
  }),
});
