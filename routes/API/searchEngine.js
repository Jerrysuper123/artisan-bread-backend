const express = require("express");
const router = express.Router();
const { Product, Flavour, Type, Ingredient } = require("../../models");

//url = baseURL/api/search/allflavours
router.get("/allflavours", async (req, res) => {
  let allFlavours = await Flavour.fetchAll();
  res.send({
    allFlavours: allFlavours.toJSON(),
  });
});

router.get("/alltypes", async (req, res) => {
  let allTypes = await Type.fetchAll();
  res.send({
    allTypes: allTypes.toJSON(),
  });
});

router.get("/allingredients", async (req, res) => {
  let allIngredients = await Ingredient.fetchAll();
  res.send({
    allIngredients: allIngredients.toJSON(),
  });
});

//url = baseURL/api/search
router.post("/", async (req, res) => {
  let q = Product.collection();
  //name, type, flavour, ingredients
  let name = req.body.name;
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

  let products = await q.fetch({
    withRelated: ["flavour", "type", "ingredients"],
  });

  res.send({
    products: products.toJSON(),
  });
  res.sendStatus(200);
});
module.exports = router;
