import {CustomizedError} from "../errorHandler/index.js";
import {productSchema} from "../models/productsModel.js";

const validateProp = {
  title: validateTitle,
  description: validateDescription,
  status: validateStatus,
  code: validateCode,
  stock: validateStock,
  price: validatePrice,
  category: validateCategory,
  image: validateImage,
  owner: validateOwner,
  rate: validateRate,
};

export function validateProduct(input) {
  let validProduct = {};

  for (const prop in productSchema) {
    const inputValue = input[prop];
    const validProp = validateProp[prop](inputValue);
    validProduct[prop] = validProp;
  }
  return validProduct;
}

export function validateTitle(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Title is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateDescription(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Description is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateStatus(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Status is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validatePrice(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Price is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateCategory(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Category is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateImage(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Image is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateOwner(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Owner is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateRate(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Rate is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateCode(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Code is required",
      status: 400,
      originalErr: null,
    });
  return value;
}

export function validateStock(value) {
  if (!value)
    throw new CustomizedError({
      name: "ValidationError",
      message: "Stock is required",
      status: 400,
      originalErr: null,
    });
  return value;
}
