import mongoose from 'mongoose';
import envVariables from './env-loader';

const options = {
  useNewUrlParser: true
};

const connectWithRetry = () => mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,options);
connectWithRetry();
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Сonnected successfully'));
