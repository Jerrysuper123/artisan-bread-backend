const express = require("express");
const router = express.Router();
const { Product, Flavour, Type, Ingredient } = require("../models");
const { bootstrapField, createProductForm } = require("../forms");

/*retrieve all products and display it */
router.get("/", async (req, res) => {
  //do not show product page if not an admin user
  const user = req.session.user;
  //if there is no such user, otherwise, show the user profile
  if (!user) {
    req.flash("error_messages", "You do not have permission to view this page");
    res.redirect("/users/login");
  }

  let products = await Product.collection().fetch({
    // pass the function created in modal to products
    //we can call this.flavour in hbs to access the relevant row
    //this.flavour.flavour to access relevant data
    withRelated: ["flavour", "type", "ingredients"],
  });
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

const fetchAllTypes = async () => {
  const allTypes = await Type.fetchAll().map((t) => {
    return [t.get("id"), t.get("type")];
  });
  return allTypes;
};

const fetchAllIngredients = async () => {
  const allIngredients = await Ingredient.fetchAll().map((i) => {
    return [i.get("id"), i.get("ingredient")];
  });
  return allIngredients;
};

const fetchProductForm = async () => {
  const allFlavours = await fetchAllFlavours();
  const allTypes = await fetchAllTypes();
  const allIngredients = await fetchAllIngredients();
  const productForm = createProductForm(allFlavours, allTypes, allIngredients);
  return productForm;
};

/*create products*/
router.get("/create", async (req, res) => {
  // fetch all flavours

  const productForm = await fetchProductForm();
  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post("/create", async (req, res) => {
  const productForm = await fetchProductForm();
  productForm.handle(req, {
    success: async (form) => {
      // all fields must match
      let { ingredients, ...productData } = form.data;
      const product = new Product(productData);
      await product.save();
      if (ingredients) {
        await product.ingredients().attach(ingredients.split(","));
      }

      req.flash(
        "success_messages",
        `New Product ${product.get("name")} has been created`
      );

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
      withRelated: ["ingredients"],
    });
  } catch (e) {
    console.log(e);
  }
  const productForm = await fetchProductForm();

  productForm.fields.name.value = product.get("name");
  productForm.fields.price.value = product.get("price");
  productForm.fields.description.value = product.get("description");
  productForm.fields.flavour_id.value = product.get("flavour_id");
  productForm.fields.type_id.value = product.get("type_id");

  //fill in multi-select for the ingredients
  let selectedIngredients = await product.related("ingredients").pluck("id");
  productForm.fields.ingredients.value = selectedIngredients;

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
      withRelated: ["ingredients"],
    });
  } catch (e) {
    console.log(e);
  }

  //process the updated info from admin user by updating the product row
  const productForm = await fetchProductForm();

  productForm.handle(req, {
    success: async (form) => {
      let { ingredients, ...productData } = form.data;
      product.set(productData);
      // put await to save data first before redirecting to product page
      await product.save();

      //ingredientIds = [1,2]
      let ingredientIds = ingredients.split(",");
      //existingIngredientIds = [1,2,3]
      let existingIngredientIds = await product
        .related("ingredients")
        .pluck("id");

      //remove all tags that are not selected anymore
      //toRemove = [3]
      let toRemove = existingIngredientIds.filter(
        (id) => ingredientIds.includes(id) === false
      );

      await product.ingredients().detach(toRemove);
      await product.ingredients().attach(ingredientIds);

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
