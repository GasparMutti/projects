import {CustomizedError} from "../errorHandler/index.js";
import {validateProduct} from "../validators/index.js";
import * as productsService from "../services/productsService.js";

export async function getAll(req, res, next) {
  try {
    const {limit, page, sort} = req.query;
    const allProducts = await productsService.getAll({limit, page, sort});

    return res.json({
      status: 200,
      message: "Products obtained successfully",
      payload: allProducts,
    });
  } catch (error) {
    if (error instanceof CustomizedError) return next(error);
    return next(
      new CustomizedError({
        name: "ControllerError",
        message: "Error when getting the products, we are working on fixing it",
        status: 500,
        originalErr: error,
      })
    );
  }
}

export async function getById(req, res, next) {
  try {
    const {id} = req.params;
    const productFound = await productsService.getById({id});

    return res.json({
      status: 200,
      message: "Product obtained successfully",
      payload: productFound,
    });
  } catch (error) {
    if (error instanceof CustomizedError) return next(error);
    return next(
      new CustomizedError({
        name: "ControllerError",
        message: "Error when getting the product,we are working on fixing it",
        status: 500,
        originalErr: error,
      })
    );
  }
}

export async function create(req, res, next) {
  try {
    const productValidated = validateProduct(product);
    const productCreated = await productsService.create(productValidated);

    return res.send({
      status: 200,
      message: "Product created successfully",
      payload: productCreated,
    });
  } catch (error) {
    if (error instanceof CustomizedError) return next(error);
    return next(
      new CustomizedError({
        name: "ControllerError",
        message: "Error when creating a product, we are working on fixing it",
        status: 500,
        originalErr: error,
      })
    );
  }
}

export async function updateById(req, res, next) {
  try {
  } catch (error) {
    return next(handleError(error));
  }
}

export async function deleteById(req, res, next) {
  try {
  } catch (error) {
    return next(handleError(error));
  }
}
