const express = require("express");
const router = express.Router();
const { Product, Flavour, Type, Ingredient } = require("../../models");

//url = baseURL/api/search/allflavours
router.get("/allflavours", async (req, res) => {
  let allFlavours = await Flavour.fetchAll();
  res.send({
    allFlavours: allFlavours.toJSON(),
  });
  return res.status(200).json;
});

router.get("/alltypes", async (req, res) => {
  let allTypes = await Type.fetchAll();
  res.send({
    allTypes: allTypes.toJSON(),
  });
  //Cannot set headers after they are sent to the client, use below to avoid above error
  return res.status(200).json;
});

router.get("/allingredients", async (req, res) => {
  let allIngredients = await Ingredient.fetchAll();
  res.send({
    allIngredients: allIngredients.toJSON(),
  });
  return res.status(200).json;
});

//url = baseURL/api/search
router.post("/", async (req, res) => {
  let q = Product.collection();
  //name, type, flavour, ingredients
  let name = req.body.name;
  console.log(name);
  //below are all ids that are passed over, for easy searching in product table;
  let typeId = req.body.typeId;
  let flavourId = req.body.flavourId;
  let ingredientIds = req.body.ingredientIds;

  if (name) {
    q = q.where("name", "like", "%" + name + "%");
  }

  //there is typeId and tyepId is not 0 (if 0, then display all product types)
  if (typeId && typeId !== "0") {
    q = q.where("type_id", "=", typeId);
  }

  if (flavourId && flavourId !== "0") {
    q = q.where("flavour_id", "=", flavourId);
  }

  //[1,2,3]=ingredientIds
  if (ingredientIds) {
    q.query("join", "ingredients_products", "products.id", "product_id").where(
      "ingredient_id",
      "in",
      ingredientIds
    );
  }

  // let products = await q.fetch({
  //   withRelated: ["flavour", "type", "ingredients"],
  // });

  // res.send({
  //   products: products.toJSON(),
  // });

  let products = await q.fetchPage({
    pageSize: 8,
    page: 1,
    withRelated: ["flavour", "type", "ingredients"],
  });

  console.log(products);

  res.send({
    products: products.toJSON(),
    pagination: products.pagination,
  });

  return res.status(200).json;
});
module.exports = router;
