const client = require('./client');

async function createAddress({
  user_id,
  phone_number,
  street01,
  street02,
  city,
  state,
  zipcode,
}) {
  console.log('Starting to create Address.. db/addresses.js');
  try {
    const {
      rows: [address],
    } = await client.query(
      `
            INSERT INTO addresses
            (user_id, phone_number, street01, street02, city, state, zipcode) 
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `,
      [user_id, phone_number, street01, street02, city, state, zipcode]
    );
    console.log('Address created..');
    console.log(address);
    console.log('Finished Creating Address! address.js');
    return address;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getAddressByUserId(user_id) {
  console.log('Starting to get address by user_id... addresses.js');
  try {
    const {
      rows: [address],
    } = await client.query(
      `
      SELECT *   
      FROM addresses
      WHERE user_id= $1;
      `,
      [user_id]
    );
    console.log('Finished Getting Address By UserId! addresses.js');
    return address;
  } catch (error) {
    console.error('Error Getting Address By UserId! addresses.js');
    throw error;
  }
}

async function updateAddress(address_id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [address],
    } = await client.query(
      `
          UPDATE addreses
          SET ${setString}
          WHERE id=${address_id}
          RETURNING *;
        `,
      Object.values(fields)
    );
    console.log('Finished Updating Address! addresses.js');
    return address;
  } catch (error) {
    console.error('Error Updating Address! addresses.js');
    throw error;
  }
}

async function deleteAddress(user_id, address_id) {
  try {
    const {
      rows: [address],
    } = await client.query(
      `
          DELETE FROM addresses
          WHERE 
          user_id=$1
          AND
          id=${address_id}
          RETURNING *;
          `,
      [user_id, address_id]
    );
    return address;
  } catch (error) {
    console.error('Error Deleting Address! db/addresses.js');
    throw error;
  }
}

module.exports = {
  createAddress,
  getAddressByUserId,
  updateAddress,
  deleteAddress,
};