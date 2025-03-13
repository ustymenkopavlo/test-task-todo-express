db = db.getSiblingDB('OX'); // Switch to "mydatabase"

db.createUser({
  user: 'devuser',
  pwd: 'devpassword',
  roles: [{ role: 'readWrite', db: 'OX' }],
});
