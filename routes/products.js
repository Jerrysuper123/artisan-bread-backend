const express = require("express");
const router = express.Router();
const { Product, Flavour } = require("../models");
const { bootstrapField, createProductForm } = require("../forms");

/*retrieve all products and display it */
router.get("/", async (req, res) => {
  // console.log("product class", Product);
  let products = await Product.collection().fetch();
  res.render("products/index", {
    products: products.toJSON(),
  });
});

const fetchAllFlavours = async () => {
  const allFlavours = await Flavour.fetchAll().map((f) => {
    return [f.get("id"), f.get("flavour")];
  });
  return allFlavours;
};

/*create products*/
router.get("/create", async (req, res) => {
  // fetch all flavours
  const allFlavours = await fetchAllFlavours();

  const productForm = createProductForm(allFlavours);
  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post("/create", async (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      const product = new Product();
      product.set("name", form.data.name);
      product.set("price", form.data.price);
      product.set("description", form.data.description);
      //save each row
      await product.save();
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("products/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

/*update products */
router.get("/:product_id/update", async (req, res) => {
  const productId = req.params.product_id;
  let product;
  try {
    product = await Product.where({
      id: productId,
    }).fetch({
      require: true,
    });
  } catch (e) {
    console.log(e);
  }

  const productForm = createProductForm();
  productForm.fields.name.value = product.get("name");
  productForm.fields.price.value = product.get("price");
  productForm.fields.description.value = product.get("description");
  res.render("products/update", {
    form: productForm.toHTML(bootstrapField),
    product: product.toJSON(),
  });
});

router.post("/:product_id/update", async (req, res) => {
  //retrieve the product row for us to update
  let product;
  try {
    product = await Product.where({
      id: req.params.product_id,
    }).fetch({
      require: true,
    });
  } catch (e) {
    console.log(e);
  }

  //process the updated info from admin user by updating the product row
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      product.set(form.data);
      // put await to save data first before redirecting to product page
      await product.save();
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("products/update", {
        form: form.toHTML(bootstrapField),
        product: product.toJSON(),
      });
    },
  });
});

/*delete product */
router.get("/:product_id/delete", async (req, res) => {
  let product;
  try {
    product = await Product.where({
      id: req.params.product_id,
    }).fetch({
      require: true,
    });
  } catch (e) {
    console.log(e);
  }

  res.render("products/delete", {
    product: product.toJSON(),
  });
});

router.post("/:product_id/delete", async (req, res) => {
  let product;
  try {
    product = await Product.where({
      id: req.params.product_id,
    }).fetch({
      require: true,
    });
  } catch (e) {
    console.log(e);
  }

  await product.destroy();
  res.redirect("/products");
});

module.exports = router;
