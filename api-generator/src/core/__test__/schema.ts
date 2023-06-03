import { DATA_TYPE, ApplicationDB, Schema, HTTP_ACTION } from '../constants';
import pluralize from 'pluralize';

// TODO: all of this gonna go to other DB

const user = 'User';
export const UserSchema: Schema = {
  name: user, // => endpoint + model: users
  prefix: pluralize(user.toLowerCase()),
  specs: {
    name: { type: DATA_TYPE.STRING, default: '' },
    age: { type: DATA_TYPE.NUMBER, default: 100 },
    address: { type: DATA_TYPE.STRING },
    gender: { type: DATA_TYPE.STRING, default: '' },
    created_at: { type: DATA_TYPE.DATE },
  },

  methods: [
    HTTP_ACTION.GET_BY_ID,
    HTTP_ACTION.GET,
    // HTTP_ACTION.UPDATE_BY_ID,
    HTTP_ACTION.UPDATE,
  ],
  // --- TODO: more
  // maybe init event, webhook, others here
};

const post = 'Post';
export const PostSchema: Schema = {
  name: post, // => endpoint + model: users
  prefix: pluralize(post.toLowerCase()),
  specs: {
    created_by: { type: DATA_TYPE.OBJECT_ID },
    content: { type: DATA_TYPE.STRING },
    created_at: { type: DATA_TYPE.DATE },
  },
  methods: [
    HTTP_ACTION.GET_BY_ID,
    HTTP_ACTION.GET,
    // HTTP_ACTION.UPDATE_BY_ID,
    HTTP_ACTION.UPDATE,
  ],
};

export const TestDB: ApplicationDB = {
  dbName: 'testDB',
  schemas: [UserSchema, PostSchema],
};
