const express = require("express");
const { Router } = express;
const router = new Router();

const Container = require("../../Container");
const container = new Container("products.json");

router.get("/", (req, res) => {
  res.send("Hola productos");
});

router.get("/getAll", async (req, res) => {
  res.json(await container.getAll());
});
router.get("/:id", async (req, res) => {
  res.json(await container.getById(req.params.id));
});

router.post("/", async (req, res) => {
  res.send(await container.save(req.body));
});

router.put("/:id", async (req, res) => {
  let product = await container.getById(req.params.id);

  product.title = req.body.title;
  product.price = req.body.price;
  product.thumbnail = req.body.thumbnail;

  res.json(await container.updateProduct(product, req.params.id));
});

router.delete("/:id", async (req, res) => {
  res.json(await container.deleteById(req.params.id));
});

module.exports = router;
