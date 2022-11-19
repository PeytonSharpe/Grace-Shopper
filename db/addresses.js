const {client} = require('./client');

async function createAddress({
  userId,
  label,
  street1,
  street2,
  city,
  state,
  zipcode,
  phone_number,
}) {
  console.log('Starting to create Address.. db/addresses.js');
  try {
    const {
      rows: [address],
    } = await client.query(
      `
            INSERT INTO addresses
            ("userId", label, street1, street2, city, state, zipcode, phone_number) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `,
      [userId, label, street1, street2, city, state, zipcode, phone_number]
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

async function getAddressByUserId(userId) {
  console.log('Starting to get address by userId... addresses.js');
  try {
    const {
      rows: [address],
    } = await client.query(
      `
      SELECT *   
      FROM addresses
      WHERE "userId"= $1;
      `,
      [userId]
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
          UPDATE addresses
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

async function deleteAddress(userId, address_id) {
  try {
    const {
      rows: [address],
    } = await client.query(
      `
          DELETE FROM addresses
          WHERE 
          "userId"=$1
          AND
          id=${address_id}
          RETURNING *;
          `,
      [userId, address_id]
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