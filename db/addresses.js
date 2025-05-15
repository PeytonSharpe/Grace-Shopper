const { client } = require('./client');

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
    console.log('Address created:', address);
    return address;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
}

async function getAddressByUserId(userId) {
  console.log('Starting to get address by userId... addresses.js');
  try {
    const { rows } = await client.query(
      `
      SELECT *   
      FROM addresses
      WHERE "userId"= $1;
      `,
      [userId]
    );
    console.log(`Found ${rows.length} addresses for userId ${userId}`);
    return rows; // return all addresses for the user
  } catch (error) {
    console.error('Error Getting Address By UserId! addresses.js', error);
    throw error;
  }
}

async function updateAddress(address_id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');

  if (setString.length === 0) {
    console.log('No fields to update for address.');
    return;
  }

  try {
    const {
      rows: [address],
    } = await client.query(
      `
      UPDATE addresses
      SET ${setString}
      WHERE id=$${Object.keys(fields).length + 1}
      RETURNING *;
      `,
      [...Object.values(fields), address_id]
    );
    console.log('Address updated:', address);
    return address;
  } catch (error) {
    console.error('Error Updating Address! addresses.js', error);
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
      WHERE "userId"=$1 AND id=$2
      RETURNING *;
