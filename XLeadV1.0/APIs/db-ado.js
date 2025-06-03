const ADODB = require('node-adodb');
const path = require('path');
 
// Log connection attempt
console.log('Attempting to connect to SQL Server using ADO');
 
// Create a connection
const connection = ADODB.open(
  'Provider=SQLOLEDB;Data Source=localhost\\SQLEXPRESS;Initial Catalog=XLead;Integrated Security=SSPI;'
);
 
// Export function to query database
async function queryDatabase(sql) {
  try {
    console.log(`Executing query: ${sql}`);
    const data = await connection.query(sql);
    console.log('Query executed successfully');
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}
 
module.exports = { queryDatabase };