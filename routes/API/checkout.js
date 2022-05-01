const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const CartServices = require("../../services/cart_services");

const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  //   const cart = new CartServices(req.session.user.id);
  //default to 2 for now as Tom
  const cart = new CartServices(2);

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
      user_id: 2,
      product_id: item.get("product_id"),
      quantity: item.get("quantity"),
    });
  }

  // step 2 - create stripe payment
  //convert json into a string when sending over the web
  let metaData = JSON.stringify(meta);
  const payment = {
    //below keys are fixed by stripe
    payment_method_types: ["card"],
    line_items: lineItems,
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
    // console.log("payment success at checkout");
    // console.log("payload", req.body);
    // console.log("sig head", req.headers["stripe-signature"]);
    // console.log("end point secret", process.env.STRIPE_ENDPOINT_SECRET);

    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    try {
      //below will try if the request is coming from stripe, if false, will catch error
      // event = Stripe.webhooks.constructEvent(
      //   payload,
      //   sigHeader,
      //   endpointSecret
      // );
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
      //sometimes api changes
      let stripeSession = event.data.object;
      console.log(stripeSession);
      let removedCart = stripeSession.metadata.orders;
      console.log("remoed cart", removedCart);
      // let userId = removedCart[0]["user_id"];
      // // let userId = removedCart[0]["user_id"];
      // console.log("userID", userId);
      // console.log(removedCart[0]);

      //   const cart = new CartServices(req.session.user.id);
      //default to 2 for now as Tom
      // const cart = new CartServices(2);

      // get all the items from the cart
      // for (let item of removedCart) {
      // let productId = item["product_id"];
      // await cart.remove(15);
      // }

      // process stripeSession
      let cart = new CartServices(2);
      await cart.removeAllCart(2);
    }
    res.send({ received: true });
    // let cart = new CartServices(2);
    //params is in the url /id/remove when user clicked remove button
    // await cart.remove("15");
  }
);

module.exports = router;
