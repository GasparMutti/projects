import {CustomizedError} from "../errorHandler/index.js";
import * as productsModel from "../models/productsModel.js";

export async function getAll({limit = 10, page = 1, sort = 1}) {
  try {
    const allProducts = await productsModel.getAll();

    if (allProducts.length === 0 || allProducts.length < limit)
      return allProducts;

    if (page > 1) allProducts.slice(0, page * limit);
    allProducts.length = limit;

    /*     if (sort) {
      if (sort === 1) allProducts.sort((a, b) => a?.price - b?.price);
      if (sort === 2) allProducts.sort((a, b) => a?.price + b?.price);
      if (sort === 3) allProducts.sort((a, b) => a?.title - b?.title);
      if (sort === 4) allProducts.sort((a, b) => a?.title + b?.title);
    } */

    return allProducts;
  } catch (err) {
    if (err instanceof CustomizedError) {
      throw err;
    }
    throw new CustomizedError({
      name: "ServiceError",
      message: "Error when getting all the products of the model",
      status: 500,
      originalErr: err,
    });
  }
}

export async function getById({id}) {
  try {
    const productFiltered = await productsModel.getById({id});
    return productFiltered;
  } catch (err) {
    if (err instanceof CustomizedError) {
      throw err;
    }
    throw new CustomizedError({
      name: "ServiceError",
      message: "Error when getting the product filtered of the model",
      status: 500,
      originalErr: err,
    });
  }
}

export async function create(product) {
  try {
    const productCreated = await productsModel.create(product);
    return productCreated;
  } catch (err) {
    if (err instanceof CustomizedError) {
      throw err;
    }
    throw new CustomizedError({
      name: "ServiceError",
      message: "Error when getting the product filtered of the model",
      status: 500,
      originalErr: err,
    });
  }
}
