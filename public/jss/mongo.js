const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`;

// Nombre de bd
const dbName = 'usuarios';
// Conexión URL (estas corriendo en local :D)

const client = new MongoClient(uri, {
  useUnifiedTopology: true
});

module.exports = async () => {
  // Conectamos al servidor
  await client.connect();

  return client.db(dbName); // retornamos la conexión con el nombre de la bd a usar
};
