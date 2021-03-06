const forms = require("forms");
const { fill } = require("lodash");
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
      // required: true,
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: ingredients,
    }),
    image_url: fields.string({
      widget: widgets.hidden(),
    }),
  });
};

/*user registration form */
const createRegistrationForm = () => {
  return forms.create({
    username: fields.string({
      required: true,
      errorAfterField: true,
    }),
    email: fields.string({
      //you can use the validator email to validate an email
      required: true,
      errorAfterField: true,
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
    }),
    //confirm to match password you have just keyed in
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      validators: [validators.matchField("password")],
    }),
    role: fields.string({
      required: true,
      errorAfterField: true,
    }),
  });
};
const createLoginForm = () => {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true,
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
    }),
  });
};

const createSearchOrderForm = () => {
  return forms.create({
    date: fields.string({
      require: false,
      errorAfterField: true,
    }),
    user_name: fields.string({
      required: false,
      errorAfterField: true,
    }),
    order_status: fields.string({
      required: false,
      errorAfterField: true,
    }),
    // flavour_id: fields.string({
    //   label: "flavour",
    //   required: true,
    //   errorAfterField: true,
    //   widget: widgets.select(),
    //   choices: flavours,
    // }),
    // type_id: fields.string({
    //   label: "type",
    //   required: true,
    //   errorAfterField: true,
    //   widget: widgets.select(),
    //   choices: types,
    // }),
    // ingredients: fields.string({
    //   // required: true,
    //   errorAfterField: true,
    //   widget: widgets.multipleSelect(),
    //   choices: ingredients,
    // }),
  });
};

module.exports = {
  createProductForm,
  createRegistrationForm,
  createLoginForm,
  bootstrapField,
  createSearchOrderForm,
};
