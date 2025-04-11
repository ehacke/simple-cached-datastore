import { Datastore } from '@google-cloud/datastore';
import axios from 'axios';
import { config } from 'dotenv';
import getenv from 'getenv';

config();
const host = getenv('DATABASE_URL');

const datastore = new Datastore({ apiEndpoint: host, namespace: 'testing', projectId: 'roleup-dev' });

datastore.reset = async () => {
  await axios.post(`${host}/reset`);
};

export default datastore;
