import _ from 'lodash';
import firebase from 'firebase';

import config from '../config';

class FirebaseService {
  database;
  constructor() {
    const { firebase: firebaseConfig } = config;
    firebase.initializeApp(firebaseConfig);
    this.database = firebase.database();
  }

  read = async (path) => {
    const snapshot = await this.database.ref(path).once('value');
    return snapshot.val();
  }

  readArray = async (path) => {
    const value = await this.read(path);
    return value ? _.values(value) : null;
  };

  write = async (path, value) => {
    await this.database.ref(path).set(value);
  };

  push = async (path, value) => this.database.ref(path).push(value);
}

export default new FirebaseService();
