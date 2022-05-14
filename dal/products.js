const { Product, Flavour, Type, Ingredient } = require("../models");

const getAllProductsWithoutPage = async () => {
  return await Product.collection().fetch({
    withRelated: ["flavour", "type", "ingredients"],
  });
};

const getAllProducts = async (pageNumber) => {
  return await Product.collection().fetchPage({
    pageSize: 8,
    page: pageNumber,
    withRelated: ["flavour", "type", "ingredients"],
  });
};

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

module.exports = {
  fetchAllFlavours,
  fetchAllTypes,
  fetchAllIngredients,
  getAllProducts,
  getAllProductsWithoutPage,
};
