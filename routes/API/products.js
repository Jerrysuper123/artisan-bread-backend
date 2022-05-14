const express = require("express");
const router = express.Router();

const { Product } = require("../../models");
const { createProductForm } = require("../../forms");
const {
  getAllProducts,
  fetchAllFlavours,
  fetchAllIngredients,
  fetchAllTypes,
  getAllProductsWithoutPage,
} = require("../../dal/products");

const fetchProductForm = async () => {
  const allFlavours = await fetchAllFlavours();
  const allTypes = await fetchAllTypes();
  const allIngredients = await fetchAllIngredients();
  const productForm = createProductForm(allFlavours, allTypes, allIngredients);
  return productForm;
};

router.get("/", async (req, res) => {
  let pageNumber = parseInt(req.query.page);
  //if there is page number fetch by page, otherwise, fetch all products
  if (pageNumber) {
    let pageResult = await getAllProducts(pageNumber);
    res.send({
      pageResult: pageResult,
      pagination: pageResult.pagination,
    });
  } else {
    res.send(await getAllProductsWithoutPage());
  }
});

router.post("/", async (req, res) => {
  const productForm = await fetchProductForm();
  productForm.handle(req, {
    success: async (form) => {
      //extract tags out and the remaining keys to be in productData
      let { ingredients, ...productData } = form.data;
      const product = new Product(productData);
      await product.save();
      if (ingredients) {
        await product.ingredients().attach(ingredients.split(","));
      }
      //do we need toJSON() below to the product
      res.send(product);
    },
    //we manually extract errors from caolan form and send back the list of validation errors
    error: async (form) => {
      let errors = {};
      //form.fields is an// how it works behind the scene
      for (let key in form.fields) {
        if (form.fields[key].error) {
          errors[key] = form.fields[key].error;
        }
      }
      //do we need to stringify below? Paul said he does not need, refer to
      res.send(errors);
    },
  });
});

module.exports = router;
