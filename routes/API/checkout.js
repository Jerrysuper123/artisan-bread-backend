const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");
const CartServices = require("../../services/cart_services");
const { createOrderItem } = require("../../dal/order_items");

const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {
  //   const cart = new CartServices(req.session.user.id);
  //default to 2 for now as Tom
  let user = req.user;
  const cart = new CartServices(user.id);

  // get all the items from the cart
  let items = await cart.getCart();

  // step 1 - create line items
  let lineItems = [];
  let meta = [];
  // send user id over to stripe, so we could use it to destroy the cart
  // meta.push({
  //   userId: 2,
  // });
  for (let item of items) {
    const lineItem = {
      name: item.related("product").get("name"),
      amount: item.related("product").get("price") * 100,
      quantity: item.get("quantity"),
      currency: "SGD",
    };
    //stripe takes in image, check if there is image url
    if (item.related("product").get("image_url")) {
      lineItem["images"] = [item.related("product").get("image_url")];
    }

    lineItems.push(lineItem);

    //stripe lineItems cannot product Id, so we use meta data to store product_id
    // save the quantity data along with the product id
    meta.push({
      // can be req.session.userid
      id: item.get("id"),
      user_id: user.id,
      quantity: item.get("quantity"),
      product_id: item.get("product_id"),
    });
  }

  // step 2 - create stripe payment
  //convert json into a string when sending over the web
  let metaData = JSON.stringify(meta);
  const payment = {
    //below keys are fixed by stripe
    payment_method_types: ["card"],
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["SG"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "SGD",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 500,
            currency: "SGD",
          },
          display_name: "Next day truck delivery",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    //where does stripe redirect too when successful transaction
    success_url:
      process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
    //with the sessionId, you can use it as an order number, saved to database if i want
    cancel_url: process.env.STRIPE_ERROR_URL,
    metadata: {
      orders: metaData,
    },
  };

  // step 3: register the session
  let stripeSession = await Stripe.checkout.sessions.create(payment);
  res.send({
    sessionId: stripeSession.id, //send to React
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post(
  "/process_payment",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        payload,
        sigHeader,
        endpointSecret
      );
    } catch (e) {
      //error is send back to stripe
      res.send({
        error: e.message,
      });
      console.log(e.message);
    }

    if (event.type == "checkout.session.completed") {
      //if completed, then we know it is from stripe
      let stripeSession = event.data.object;
      // console.log(stripeSession);
      let shippingAddressObj = stripeSession.shipping.address;
      let shippingAddress;
      // console.log("shipping address", shippingAddressObj["line1"]);
      shippingAddress = `
        ${shippingAddressObj["country"]}, ${shippingAddressObj["line1"]}, ${shippingAddressObj["line2"]}, SG ${shippingAddressObj["postal_code"]}
      `;
      //metadata is in json string, so we need to parse them into json data
      let removedCart = JSON.parse(stripeSession.metadata.orders);
      console.log("removed cart", removedCart);
      let userId = removedCart[0]["user_id"];

      try {
        //add removed cart to order table
        let orderDate = new Date().toLocaleString("en-sg", {
          timeZone: "Asia/Singapore",
        });

        for (let c of removedCart) {
          await createOrderItem(
            orderDate,
            c.quantity,
            c.user_id,
            c.product_id,
            shippingAddress
          );
        }
        // delete the cart in the cart database
        let cart = new CartServices(userId);
        await cart.clearCartByUser();
      } catch (e) {
        console.log(e);
      }
    }
    res.send({ received: true });
  }
);

module.exports = router;
