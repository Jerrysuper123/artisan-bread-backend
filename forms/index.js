const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }

  if (object.widget.classes.indexOf("form-control") === -1) {
    object.widget.classes.push("form-control");
  }

  var validationclass = object.value && !object.error ? "is-valid" : "";
  validationclass = object.error ? "is-invalid" : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error
    ? '<div class="invalid-feedback">' + object.error + "</div>"
    : "";

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + "</div>";
};

const createProductForm = (flavours, types, ingredients) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
    }),
    price: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.integer()],
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
    }),
    flavour_id: fields.string({
      label: "flavour",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: flavours,
    }),
    type_id: fields.string({
      label: "type",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: types,
    }),
    ingredients: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: ingredients,
    }),
  });
};

module.exports = { createProductForm, bootstrapField };
