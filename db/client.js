const { client } = require('./client'); // adjust path if needed

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to the database successfully!');
    // Optional: run a simple query to test
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  } finally {
    await client.end();
  }
}

testConnection();
// module.exports = {
//   testConnection,  //   // other exports if needed
// };