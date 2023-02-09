INSERT INTO users (username, name, email, password, active, "isAdmin") 
VALUES ('admin', 'Site Admin','whatever@email.com', '8675309', true, true),
       ('testuser1', 'Test User One','whatever1@email.com', 'test1234', true, false),
       ('testuser2', 'Test User Two','whatever2@email.com', 'test1234', true, false);

---create categories
INSERT INTO products (title, description, price, count, image) 
VALUES ('Gameboy Original!', 'An Original Gameboy Black and White!', 999.99, 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMiiZCrzXRvcnCj1zwrKsOZkMdnR_YL5hIkw&usqp=CAU'),
       ('T2 Pinball Machine', 'Classic Terminator 2 Pinball Machine!', 100, 100, 'https://sternpinball.com/wp-content/uploads/2018/12/flipper-terminator-3-vf107-aab.png'),
       ('Twisted Metal', 'PS1 Twisted Metal Game CD', 10, 100, 'https://i0.wp.com/gamecomplaintdepartment.com/wp-content/uploads/2019/04/twisted-metal-playstation-front-cover.jpg?fit=800%2C783&ssl=1'),
       ('Pacman', 'Modern Pacman Arcade Cabinet', 30, 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCrU-PVrIFISAP7fBl2uuAoEhTK4t3VjNcANQ88r73fdjiwuK6zoNmQsRPqwxD2ZdzgmE&usqp=CAU'),
       ('Galaga', 'Classic Galaga Arcade Cabinet', 999.99, 100, 'https://i.etsystatic.com/5896056/r/il/795637/1048144274/il_794xN.1048144274_14nf.jpg'),
       ('Duck Hunt', 'NES Duckhunt Classic Cartridge', 999.99, 100, 'https://m.media-amazon.com/images/I/71nz2DryhML._SX425_.jpg'),
       ('Super Mario Kart', 'SNES Mario Cart Original Cartridge!', 999.99, 100, 'https://cdn.vox-cdn.com/thumbor/pP0kKYQ924Pj6CValfh7oGTsdRA=/0x0:2100x1534/920x0/filters:focal(0x0:2100x1534):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/3826880/2364824-snes_supermariokart.0.jpg'),
       ('PitFall', 'Atari PITFALL Original Cartridge', 999.99, 100, 'https://cdn11.bigcommerce.com/s-ymgqt/images/stencil/320w/products/23064/14363/Game%20Atari%202600-pitfall-2__93778.1670452910.jpg?c=2'),
       ('Power Glove', 'Nintendo Power Glove!', 999.99, 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnhaCXFG8zxc-9wOasK78GUpsLhJLP81yXQ&usqp=CAU'),
       ('N64 Controller', 'N64 Controller Original', 999.99, 100, 'https://m.media-amazon.com/images/I/51LiSZkgGKL.jpg'),
       ('Atari 2600 Console', 'Original ATari 2600 Wood Panel Console!!', 999.99, 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHL8Ws_iaTBhOrCjzKIrkQb_x8JsRQdoS1SIIYCERCBm2af9E20Suq0FZWk8Z3c3rrrVc&usqp=CAU'),
       ('Nintendo Wii Carrying Case', 'Carrying Satchel to carry your Wii and accessories!', 999.99, 100, 'https://i.ebayimg.com/images/g/r5UAAOSwoZ1jbnnX/s-l500.jpg');

---create categories
INSERT INTO categories (name, description) 
VALUES ('Consoles FIX THIS', 'Console Systems FIX THIS'),
       ('Cabinets', 'Arcade Style Cabinet Games'),
       ('Games', 'List of games'),
       ('Cartridges', 'Cartridge Style Games'),
       ('Pinball Machines', 'Pinball Machines'),
       ('Handheld Systems', 'Handheld Systems'),
       ('CDs', 'CD Style Games'),
       ('Accessories', 'Accessories'),
       ('Controllers', 'Controllers'),
       ('Other', 'Other'),
       ('test to Delete', 'Delete this Category');

--- insert data in address
-- INSERT INTO addresses (userId, label, street1, street2, city, state, zipcode, phone_number) 
-- VALUES (1, "DEFAULT",'221 Baker St', 'Apartment B', 'London', 'OH', '43140', '5555555555');