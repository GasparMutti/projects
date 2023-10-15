import * as productsController from "../controllers/productsController.js";
import {Router} from "express";

const router = Router();

router.get("/", productsController.getAll);
router.post("/", productsController.create);

router.get("/:id", productsController.getById);
router.patch("/:id", productsController.updateById);
router.delete("/:id", productsController.deleteById);

export default router;
