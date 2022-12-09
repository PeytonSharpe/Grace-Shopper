const {
  client,
  createProduct,
  getAllProducts,
  getProductById,
  getAllProdCategories,
  getProductByCategory,
  getCategoryByName,
  createUser,
  getAllUsers,
  getUser,
  getUserByUsername,
  updateUser,
  getUserById,
  createCategory,
  updateCategory,
  deleteCategory,
  addCategoryToProduct,
  deleteProduct,
  getAllCategories,
  createAddress,
  getAddressByUserId,
  updateAddress,
  // deleteAddress,

} = require('./index')


async function dropTables() {
  try {
    console.log('Dropping Tables')
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS prod_categories;
      DROP TABLE IF EXISTS wishlist;
      DROP TABLE IF EXISTS addresses;
      DROP TABLE IF EXISTS purchases;
      DROP TABLE IF EXISTS cart;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
     
    `)

    console.log('Finished Dropping Tables')
  }
  catch (ex) {
    console.log('Error dropping tables')
  }
}

async function createTables() {
  try {
    console.log('Creating Tables')
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true,
        "isAdmin" BOOLEAN DEFAULT false
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL, 
        description VARCHAR(255),
        price DECIMAL(10,2) DEFAULT 999.99,
        count INTEGER,
        active BOOLEAN DEFAULT true,
        "isPublic" BOOLEAN DEFAULT true,
        image VARCHAR(255)
      );

      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR(255),
        "isPublic" BOOLEAN DEFAULT true        
      );

      CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id)

      );
      
      CREATE TABLE purchases (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "cartId" INTEGER, 
        date TIMESTAMP,
        price NUMERIC(10,2)
      );  

      CREATE TABLE addresses (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        label VARCHAR(255) NOT NULL,
        street1 VARCHAR(255) NOT NULL,
        street2 VARCHAR(255),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(2) NOT NULL,
        zipcode VARCHAR(8) NOT NULL,
        phone_number CHAR(10)
      );

      CREATE TABLE wishlist (
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id)
      );
      
      CREATE TABLE prod_categories (
        "productId" INTEGER REFERENCES products(id),
        "categoryId" INTEGER REFERENCES categories(id)
      );
      
      CREATE TABLE reviews (
        review VARCHAR(500),
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id),
        stars INTEGER 
      )



    `);

    console.log('Finished Creating Tables')
  }
  catch (error) {
    console.log('Error creating tables')
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log('Starting to create users...')
    const admin = await createUser({
      username: 'admin',
      password: '8675309',
      email: 'whatever@email.com',
      name: 'Site Admin',
      active: true,
      isAdmin: true
    });

    const testUser1 = await createUser({
      username: 'testuser1',
      password: 'test1234',
      name: 'Test User One',
      email: 'whatever1@email.com',
      active: true

    });

    const testUser2 = await createUser({
      username: 'testuser2',
      password: 'test1234',
      name: 'Test User Two',
      email: 'whatever2@email.com',
      active: true
    });

    console.log("---INITIAL USERS---", admin, testUser1, testUser2)

    console.log('Finished creating users');
  } catch (error) {
    console.log("Error creating users");
    throw (error);
  }
}

async function createInitialProducts() {
  try {
    console.log('Starting to create products...')
    await createProduct({
      title:
        "Gameboy Original!",
      description:
        "An Original Gameboy Black and White!",
      price: 999.99,
      count: 100,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMiiZCrzXRvcnCj1zwrKsOZkMdnR_YL5hIkw&usqp=CAU'
    });

    await createProduct({
      title:
        "T2 Pinball Machine",
      description:
        "Classic Terminator 2 Pinball Machine!",
      count: 100,
      image: 'https://sternpinball.com/wp-content/uploads/2018/12/flipper-terminator-3-vf107-aab.png'
    });

    await createProduct({
      title:
        "Twisted Metal",
      description:
        "PS1 Twisted Metal Game CD",
      count: 100,
      image: 'https://i0.wp.com/gamecomplaintdepartment.com/wp-content/uploads/2019/04/twisted-metal-playstation-front-cover.jpg?fit=800%2C783&ssl=1'
    });

    await createProduct({
      title:
        "Pacman",
      description:
        "Modern Pacman Arcade Cabinet",
      count: 100,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCrU-PVrIFISAP7fBl2uuAoEhTK4t3VjNcANQ88r73fdjiwuK6zoNmQsRPqwxD2ZdzgmE&usqp=CAU'
    });

    await createProduct({
      title:
        "Galaga",
      description:
        "Classic Galaga Arcade Cabinet",
      count: 100,
      image: 'https://i.etsystatic.com/5896056/r/il/795637/1048144274/il_794xN.1048144274_14nf.jpg'
    });

    await createProduct({
      title:
        "Duck Hunt",
      description:
        "NES Duckhunt Classic Cartridge",
      count: 100,
      image: 'https://m.media-amazon.com/images/I/71nz2DryhML._SX425_.jpg'
    });

    await createProduct({
      title:
        "Super Mario Kart",
      description:
        "SNES Mario Cart Original Cartridge!",
      count: 100,
      image: 'https://cdn.vox-cdn.com/thumbor/pP0kKYQ924Pj6CValfh7oGTsdRA=/0x0:2100x1534/920x0/filters:focal(0x0:2100x1534):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/3826880/2364824-snes_supermariokart.0.jpg'
    });

    await createProduct({
      title:
        "PitFall",
      description:
        "Atari PITFALL Original Cartridge",
      count: 100,
      image: 'https://cdn11.bigcommerce.com/s-ymgqt/images/stencil/320w/products/23064/14363/Game%20Atari%202600-pitfall-2__93778.1670452910.jpg?c=2'
    });

    await createProduct({
      title:
        "Power Glove",
      description:
        "Nintendo Power Glove!",
      count: 100,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnhaCXFG8zxc-9wOasK78GUpsLhJLP81yXQ&usqp=CAU'
    });

    await createProduct({
      title:
        "N64 Controller",
      description:
        "N64 Controller Original",
      count: 100,
      image: 'https://m.media-amazon.com/images/I/51LiSZkgGKL.jpg'
    });

    await createProduct({
      title:
        "Atari 2600 Console",
      description:
        "Original ATari 2600 Wood Panel Console!!",
      count: 100,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHL8Ws_iaTBhOrCjzKIrkQb_x8JsRQdoS1SIIYCERCBm2af9E20Suq0FZWk8Z3c3rrrVc&usqp=CAU'
    });

    await createProduct({
      title:
        "Nintendo Wii Carrying Case",
      description:
        "Carrying Satchel to carry your Wii and accessories!",
      count: 100,
      image: 'https://i.ebayimg.com/images/g/r5UAAOSwoZ1jbnnX/s-l500.jpg'
    });

    console.log('Finished creating Products')
  }
  catch (ex) {
    console.log('Error creating Products')
    throw error;
  }
}

async function createInitialCategories() {
  try {
    console.log('Creating initial categories')
    const consoles = await createCategory({
      name: "Consoles FIX THIS",
      description: "Console Systems FIX THIS"
    });
    console.log("Created Consoles Category", consoles)

    const cabinets = await createCategory({
      name: "Cabinets",
      description: "Arcade Style Cabinet Games"
    });
    console.log("Created Cabinets Category", cabinets)

    const games = await createCategory({
      name: "Games",
      description: "List of games"
    });
    console.log("Created Games Category", games)

    const cartridges = await createCategory({
      name: "Cartridges",
      description: "Cartridge Style Games"
    });

    const pinball = await createCategory({
      name: "Pinball Machines",
      description: "Pinball Machines"
    });

    const handhelds = await createCategory({
      name: "Handheld Systems",
      description: "Handheld Systems"
    });

    const cds = await createCategory({
      name: "CDs",
      description: "CD Style Games"
    });

    const accessories = await createCategory({
      name: "Accessories",
      description: "Accessories"
    });

    const controllers = await createCategory({
      name: "Controllers",
      description: "Controllers"
    });

    const other = await createCategory({
      name: "Other",
      description: "Other"
    });

    const test = await createCategory({
      name: "test to Delete",
      description: "Delete this Category"
    })
  }
  catch (error) {
    console.log("Error creating categories")
    throw error;
  }
}

async function createInitialAddress() {
  try {
    const admin = await getUserByUsername("admin");

    console.log("Creating Initial Address")
    const adminAddress = await createAddress({
      userId: admin.id,
      label: "DEFAULT",
      street1: "221 Baker St",
      street2: "Apartment B",
      city: "London",
      state: "OH",
      zipcode: "43140",
      phone_number: "5555555555"

    });
    console.log("Admin Address", adminAddress)
  }
  catch (error) {
    console.log("Error creating address")
    throw error;
  }
}

async function buildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCategories();
    await createInitialAddress();
  }
  catch (error) {
    console.log('Error building the DB')
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting DB tests")

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("User Test Result:", users);

    console.log("Getting user by Id '1'")
    const user1 = await getUserById(1)
    console.log("user 1 = ", user1)

    console.log("Geting User with name and password of 'testuser1'")
    const authUser = await getUser({
      username: 'testuser1',
      password: 'test1234'
    })
    console.log("autheticated user = ", authUser)

    console.log("Getting User by username of 'admin'")
    const userByUsername = await getUserByUsername('admin')
    console.log("username of 'admin' = ", userByUsername)

    console.log("Updating user 'testuser2' to 'testuser02'")
    const updatedUser = await updateUser(users[2].id, {
      username: "testuser02"
    });
    console.log("Updated User = ", updatedUser)

    console.log("Calling getAllProducts")
    const products = await getAllProducts();
    console.log("Product Test Result:", products)

    console.log("Getting product by id")
    const product1 = await getProductById(1)
    console.log("Product by id = ", product1)


    console.log("Adding Category to Product")
    const [productOne, T2pb, twistedMetal, pacman, galaga, duckHunt, smk, pitfall, powerGlove, n64Con, atari, wii ] = await getAllProducts();

    await addCategoryToProduct({
      productId: productOne.id,
      categoryId: 6
    });

    await addCategoryToProduct({
      productId: T2pb.id,
      categoryId: 3
    });

    await addCategoryToProduct({
      productId: T2pb.id,
      categoryId: 5
    });

    await addCategoryToProduct({
      productId: twistedMetal.id,
      categoryId: 3
    });

    await addCategoryToProduct({
      productId: twistedMetal.id,
      categoryId: 7
    });

    await addCategoryToProduct({
      productId: pacman.id,
      categoryId: 2
    });

    await addCategoryToProduct({
      productId: galaga.id,
      categoryId: 2
    });

    await addCategoryToProduct({
      productId: duckHunt.id,
      categoryId: 4
    });

    await addCategoryToProduct({
      productId: duckHunt.id,
      categoryId: 3
    });

    await addCategoryToProduct({
      productId: smk.id,
      categoryId: 4
    });

    await addCategoryToProduct({
      productId: smk.id,
      categoryId: 3
    });

    await addCategoryToProduct({
      productId: pitfall.id,
      categoryId: 4
    });

    await addCategoryToProduct({
      productId: pitfall.id,
      categoryId: 3
    });

    await addCategoryToProduct({
      productId: powerGlove.id,
      categoryId: 8
    });

    await addCategoryToProduct({
      productId: n64Con.id,
      categoryId: 9
    });

    await addCategoryToProduct({
      productId: atari.id,
      categoryId: 1
    });

    await addCategoryToProduct({
      productId: wii.id,
      categoryId: 10
    });

    console.log(await getAllProdCategories())

    console.log("Calling getAllCategories");
    const categories = await getAllCategories();
    console.log("Categories Test: Result:", categories)

    console.log("Getting Product by Category 'games'")
    const productsInGamesCat = await getProductByCategory("Games");
    console.log("Result", productsInGamesCat)

    console.log("Updating a Category")
    const updatedCategory = await updateCategory(categories[0].id, {
      name: "Consoles",
      description: "Console Systems"
    });
    console.log("The Updated Category Result:", updatedCategory)

    console.log("Deleting Test Category")
    const result = await deleteCategory(categories[10].id);

    console.log(result)
    const updatedCategories = await getAllCategories();
    console.log("Categories without 11", updatedCategories)

    console.log("Getting address by user id '1'")
    const user0Address = await getAddressByUserId(1);
    console.log("user id 0 address = ", user0Address)

    console.log("Updating address for 'admin'")
    const updatedAddress = await updateAddress(user0Address.id, {
      label: 'Home',
      phone_number: '7403853774'
    });
    console.log("Updated address = ", updatedAddress)
    console.log('Finished')
  } catch (error) {
    console.error("testDB-seed.js FAILED", error)
  }
}


buildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end())