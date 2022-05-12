# Artisan BREAD Admin Site
This is the back end admin site support front-end [ecommerce site](https://chic-crostata-11c4b4.netlify.app.

The website must be fully functional for the business owner to manage its online business. Customers are able to register and log in as users, adding to cart and checking out. On the admin site, the business owner is able to manage the order and notify customers when the order is ready to dispatch.

- Access the live back-end admin page [here](https://artisanbread.herokuapp.com).


# admin site map
Back-end admin site
1. Admin user log in/register
2. Create, update, delete product catalogue
3. Manage order
4. Tiered access for different admin users

- owner is able to access all pages on the admin site
- manager is restricted on product deletion, order deletion and registering new admin user

![site map](https://github.com/Jerrysuper123/artisanbreadsources/blob/main/adminSiteMap.png?raw=true
)

# admin skeleton
Based on the site map, access admin wireframe here [here](https://github.com/Jerrysuper123/artisanbreadsources/blob/main/bandEndSkeleton.pdf
)

# Database design
<em>One to many relationship</em>
- Product to Type
- Product to Flavour

<em>Many to many relationship</em>
- Product to Ingredient
- Cart_item to User and Product
- Order_item to User and Product

ERA diagram
![ERA digram](https://github.com/Jerrysuper123/artisanbreadsources/blob/main/ERA%20Diagram.png?raw=true)

Mysql database design
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

Upon successful verification, the server will send over a Json Web Token. 

POST
```
https://artisanbread.herokuapp.com/api/users/login
```
>From this point onwards, below end_points have to been consumed with a JSON Web Token sent over to server for verification purpose.

## Customer profile

GET
```
https://artisanbread.herokuapp.com/api/users/profile
```

## Product

retrieva all products in database
GET
```
https://artisanbread.herokuapp.com/api/products
```
## Product search engine

Combining with multiple parameters, making sophisticated query is possible.

GET
| parameter  | value | usage  | 
| ------------- | ------------- | ------------- |
| name  | string  | search by product title  |
| type ID  | numeric  | search by product type ID  |
| flavour ID  | numeric |search by flavour ID  |
| Ingredient ID  | numeric |search by Ingredient IDs (multi-select)  |

## Cart
Get the user's cart
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

retrieve current user's order
GET
```
https://artisanbread.herokuapp.com/api/order
```

# Checkout

Send over publishable and session ID for redirect on react front
GET
```
https://artisanbread.herokuapp.com/api/checkout
```

# Strip webhooks

Secure, we verify if it is coming from Stripe
POST
```
https://artisanbread.herokuapp.com/api/checkout/process_payment
```

Webhooks for Stripe to infrom us, but this is not part of the API design.


# Testing
Testing is done for all http methods using [Advanced Rest Client](https://install.advancedrestclient.com/install).

# Deployment steps
The deployment is done through [Heroku](https://devcenter.heroku.com/articles/git#deploy-your-code).
