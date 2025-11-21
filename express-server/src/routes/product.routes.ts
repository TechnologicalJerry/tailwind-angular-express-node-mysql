import { Router } from 'express';
import {
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controller/product.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from '../schema/product.schema';

const router = Router();

/**
 * @openapi
 * '/api/products':
 *  post:
 *    tags:
 *    - Products
 *    summary: Create a product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schema/Product'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/productResponse'
 *      403:
 *        description: Forbidden
 */
router.post('/', [requireUser, validateResource(createProductSchema)], createProductHandler);

/**
 * @openapi
 * '/api/products/{productId}':
 *  get:
 *    tags:
 *    - Products
 *    summary: Get a single product by the productId
 *    parameters:
 *    - name: productId
 *      in: path
 *      description: The id of the product
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/productResponse'
 *      404:
 *        description: Product not found
 */
router.get('/:productId', validateResource(getProductSchema), getProductHandler);

/**
 * @openapi
 * '/api/products/{productId}':
 *  put:
 *    tags:
 *    - Products
 *    summary: Update a single product
 *    parameters:
 *    - name: productId
 *      in: path
 *      description: The id of the product
 *      required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schema/Product'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/productResponse'
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Product not found
 */
router.put('/:productId', [requireUser, validateResource(updateProductSchema)], updateProductHandler);

/**
 * @openapi
 * '/api/products/{productId}':
 *  delete:
 *    tags:
 *    - Products
 *    summary: Delete a single product
 *    parameters:
 *    - name: productId
 *      in: path
 *      description: The id of the product
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Product not found
 */
router.delete('/:productId', [requireUser, validateResource(deleteProductSchema)], deleteProductHandler);

export default router;
