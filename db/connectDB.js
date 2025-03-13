import mongoose from 'mongoose';

const connectDB = () => {
  const url = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;

  try {
    mongoose.connect(`${url}/${dbName}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const db = mongoose.connection;
  db.once('open', () => {
    console.log(`Database connected.`);
  });

  db.on('error', (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
};

export default connectDB;
