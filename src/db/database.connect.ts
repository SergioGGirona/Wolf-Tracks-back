import mongoose from 'mongoose';

export const databaseConnect = () => {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const dbName = 'Wolf_Tracks';
  const uri = `mongodb+srv://${user}:${password}@cluster0.dtab9ut.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
