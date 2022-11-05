
Potential site name: Slightly Sketchy Game Things 

product we gonna be sellin: retro games and systems
    - need up to like 10 to 20 items
selling table: 
    - users
        pimary keys
        username 
        password
        payment option
        admin account
        - how do we make one of these? 
            -is the info hardcoded in
    - Products
        -items
            -productID
            -description
            -title
    - Categories
        -
    - Orders
        - active (in cart/ shipped)
        - past order history (fulfilled)
    - Reviews
Routes: 
    - Register
    - Home
    - single post
    - all posts
    - all category posts
    Y- cart
    - orders
    Y- products
    Y- reviews
    Y- Users (i.e. My Account)
    - wishlist
    - index
    - utils
        - require user
        - require admin
order of opps
    - attaching items to categories or vice versa
    - 
    - adding item to cart
        - match productID to userID : to display items that you've added to ur cart
        - either 'keep shopping'
        - or 'proceed to check out'


Table Creation (PSQL)[goes in seed.js]
- Users
    - username
        -SERIAL key for user id
    -password
    -actual name
    - active
    - isAdmin (default False) 
    - address info [sep table to confirm not null & accuracy]

- Produtcs table 
    - productID
    - count (default 0)
    - title UNIQUE NOT NULL
    - description
    - price NUMERIC NOT NULL
    - image ???(can be attached from a seperate file)

- Categories
    - consoles
    - vidya games
    - accessories
    - name
    - description
    - active
        -In or Out of Stock
    - isPublic (default true)

- Shopping Cart
    - id SERIAL PRIMARY KEY
    - user_id INTEGER REFERENCES users(id)
    - productID INTEGER REFERENCES products(id)
    - quantity INTEGER NOT NULL
    - total_price NUMERIC(10,2) NOT NULL
    (revisit)- purchased BOOLEAN DEFAULT false
        - work on:
            - +/- functionality WITHIN the cart
            - wld the cart as a whole need to be saved, to populate the purchase history?
            - every pruchased cart wld need to have it's own id 

- Addresses
    - user_id INTEGER REFERENCES users(id),
    - label VARCHAR(255),
    - street1 VARCHAR(255) NOT NULL,
    - street2 VARCHAR(255),
    - city VARCHAR(255) NOT NULL,
    - state VARCHAR(2) NOT NULL,
    - zip INTEGER NOT NULL

- Wishlist
    - id SERIAL PRIMARY KEY
    - user_id INTEGER REFERENCES users(id)
    - product_id INTEGER REFERENCES products(id)


Routes!
    Home
    Navbar
        -logout bttn
        -my account
        -cart
        -~~search input 
    login
    register
    review
    cart
        -checkout
    edit cart
        - add / remove items
        - +/- item count
    products
    category
        -sys
        -games
        -accessories
    create products (admin)
    edit products (admin)
    utils