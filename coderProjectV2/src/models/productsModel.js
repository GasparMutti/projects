import {CustomizedError} from "../errorHandler/index.js";
import {validateProduct} from "../validators/index.js";
import {randomUUID} from "node:crypto";
import {resolve} from "node:path";
import {readFile, writeFile} from "node:fs/promises";

const productsPath = resolve("src/database/products.json");

export const productSchema = {
  title: "string",
  description: "string",
  price: "number",
  code: "string",
  status: "boolean",
  stock: "number",
  category: "string",
  image: "string",
  owner: "string",
  rate: "number",
};

export async function getAll() {
  try {
    const document = await readFile(productsPath, "utf8");
    const allProducts = JSON.parse(document);
    return allProducts;
  } catch (err) {
    throw new CustomizedError({
      name: "ConnectionError",
      message: "Error when obtaining the products from the database",
      status: 500,
      originalErr: err,
    });
  }
}

export async function getById({id}) {
  try {
    const allProducts = await getAll();
    const productFound = allProducts.find((product) => product.id === id);
    if (!productFound)
      throw new CustomizedError({
        name: "RequestError",
        message: "It was not possible to find a product with the provided id",
        status: 404,
        originalErr: null,
      });
    return productFound;
  } catch (err) {
    if (err instanceof CustomizedError) throw err;
    throw new CustomizedError({
      name: "ConnectionError",
      message: "Error when obtaining the product from the database",
      status: 500,
      originalErr: err,
    });
  }
}

export async function create(product) {
  try {
    const allProducts = await getAll();
    const productValidated = validateProduct(product);

    const existCode = allProducts.find(
      (product) => product.code === productValidated.code
    );

    if (existCode)
      throw new CustomizedError({
        name: "RequestError",
        message:
          "Error when creating the product, the product code already exists.",
        status: 400,
        originalErr: null,
      });

    const newProduct = {
      ...productValidated,
      id: randomUUID(),
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };

    allProducts.push(newProduct);
    await writeFile(productsPath, JSON.stringify(allProducts));

    return newProduct;
  } catch (err) {
    if (err instanceof CustomizedError) throw err;
    throw new CustomizedError({
      name: "ConnectionError",
      message: "Error when obtaining the products from the database",
      status: 500,
      originalErr: err,
    });
  }
}
