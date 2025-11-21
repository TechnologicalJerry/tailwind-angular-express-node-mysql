import { Router } from 'express';
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from '../controller/session.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/session.schema';

const router = Router();

/**
 * @openapi
 * '/api/sessions':
 *  post:
 *    tags:
 *    - Session
 *    summary: Create a session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateSessionInput'
 *    responses:
 *      200:
 *        description: Session created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateSessionResponse'
 *      401:
 *        description: Invalid email or password
 */
router.post('/', validateResource(createSessionSchema), createUserSessionHandler);

/**
 * @openapi
 * '/api/sessions':
 *  get:
 *    tags:
 *    - Session
 *    summary: Get all sessions for a user
 *    responses:
 *      200:
 *        description: User sessions
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetSessionResponse'
 *      403:
 *        description: Forbidden
 */
router.get('/', requireUser, getUserSessionsHandler);

/**
 * @openapi
 * '/api/sessions':
 *  delete:
 *    tags:
 *    - Session
 *    summary: Delete a session
 *    responses:
 *      200:
 *        description: Session deleted
 *      403:
 *        description: Forbidden
 */
router.delete('/', requireUser, deleteSessionHandler);

export default router;
