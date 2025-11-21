import { Request, Response } from "express";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../service/product.service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user.id;

  const body = req.body;

  const product = await createProduct({ ...body, user_id: userId });

  return res.send(product);
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user.id;

  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ product_id: productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (product.user_id !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await findAndUpdateProduct({ product_id: productId }, update, {
    new: true,
  });

  return res.send(updatedProduct);
}

export async function getProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;
  const product = await findProduct({ product_id: productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}

export async function deleteProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user.id;
  const productId = req.params.productId;

  const product = await findProduct({ product_id: productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (product.user_id !== userId) {
    return res.sendStatus(403);
  }

  await deleteProduct({ product_id: productId });

  return res.sendStatus(200);
}
