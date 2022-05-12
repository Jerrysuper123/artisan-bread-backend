# Artisan BREAD Admin Site
This is the back end admin site support front-end [ecommerce site](https://chic-crostata-11c4b4.netlify.app).

The website must be fully functional for the business owner to manage its online business. On the admin site, the business owner is able to manage the order and notify customers when the order is ready to dispatch.

- Access the live back-end admin page [here](https://artisanbread.herokuapp.com).


# Admin site map
Back-end admin site
1. Admin user log in/register
2. Create, update, delete product catalogue
3. Manage order
4. Tiered access for different admin users

- owner is able to access all pages on the admin site
- manager is granted access to all, but restricted on product deletion, order deletion and registering new admin user

![site map](https://github.com/Jerrysuper123/artisanbreadsources/blob/main/adminSiteMap.png?raw=true
)

# Admin page wireframe
Based on the site map, access admin wireframe [here](https://github.com/Jerrysuper123/artisanbreadsources/blob/main/bandEndSkeleton.pdf
)

# Database design
<em>One to many relationship</em>
- Product to Type
- Product to Flavour

<em>Many to many relationship</em>
- Product to Ingredient
- Cart_item to User and Product
- Order_item to User and Product

## ERA diagram
![ERA digram](https://github.com/Jerrysuper123/artisanbreadsources/blob/main/ERA%20Diagram.png?raw=true)

## Mysql database design
![database design](https://raw.githubusercontent.com/Jerrysuper123/artisanbreadsources/main/artisan_bread.png)

# Restful API

Besides admin page to manage product catalogue and orders, we built a restful API, to be consumed by the front-end react app.

## Base end_point deployed on Heroku
```
https://artisanbread.herokuapp.com/api
```

## Customer registration
Customers could register their own accounts, using below end_point:

POST
```
https://artisanbread.herokuapp.com/api/users/register
```

## Customer log in
Customers could login through below:

POST
```
https://artisanbread.herokuapp.com/api/users/login
```
Upon successful login, the server will send over a Json Web Token (JWT). 
From this point onwards, below end_points have to been consumed with a JWT.


## Customer profile

GET
```
https://artisanbread.herokuapp.com/api/users/profile
```

## Product

To retrieva all products from the database:

GET
```
https://artisanbread.herokuapp.com/api/products
```

## Product search engine

Combining with multiple parameters, sophisticated product query is possible.

GET
| parameter  | value | usage  | 
| ------------- | ------------- | ------------- |
| name  | string  | search by product title  |
| type ID  | numeric  | search by product type ID  |
| flavour ID  | numeric |search by flavour ID  |
| Ingredient ID  | numeric |search by Ingredient IDs (multi-select)  |

## Cart
Get current user's cart

GET
```
https://artisanbread.herokuapp.com/api/cart
```

Add to cart

GET
```
https://artisanbread.herokuapp.com/api/cart/:product_id/add
```

Remove from cart

GET
```
https://artisanbread.herokuapp.com/api/cart/:product_id/remove
```

Update cart quantity

POST
```
https://artisanbread.herokuapp.com/api/cart/:product_id/quantity/update
```

# Order

To retrieve current user's order:

GET
```
https://artisanbread.herokuapp.com/api/order
```

# Checkout
The checkout is processed by Stripe. Once successful checkout, our server will send over both Publishable ID and Session ID for front-end react App to redirect to Stripe checkout page.

GET
```
https://artisanbread.herokuapp.com/api/checkout
```

# Stripe webhooks

Upon successful checkout, Stripe will consume below end point, sending over to our server the checkout information.

POST
```
https://artisanbread.herokuapp.com/api/checkout/process_payment
```

# Testing
Testing is done for all http methods using [Advanced Rest Client](https://install.advancedrestclient.com/install).

# Deployment steps
The deployment is done through [Heroku](https://devcenter.heroku.com/articles/git#deploy-your-code).
