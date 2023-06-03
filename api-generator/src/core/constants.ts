import mongoose from 'mongoose';

export const HTTP_METHOD: Record<string, string> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
  OPTION: 'option',
};

export const ACTION_TO_METHOD: Record<string, string> = {
  getByIdHandler: 'get',
  getHandler: 'get',
  updateHandler: 'post',
  updateByIdHandler: 'post',
  putHandler: 'put',
  putByIdHandler: 'put',
  deleteHandler: 'delete',
  deleteByIdHandler: 'delete',
};

export const HTTP_ACTION: Record<string, string> = {
  GET_BY_ID: 'getByIdHandler',
  GET: 'getHandler',
  UPDATE_BY_ID: 'updateByIdHandler',
  UPDATE: 'updateHandler',
  PUT: 'putHandler',
  PUT_BY_ID: 'putByIdHandler',
  DELETE: 'deleteHandler',
  DELETE_BY_ID: 'deleteByIdHandler',
};

export const DATA_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  DATE: 'date',
  ENUM: 'enum',
  BOOLEAN: 'boolean',
  OBJECT_ID: 'ObjectID',
};

export interface SchemaSpec {
  type: string;
  default?: any;
}

export interface SchemaSpecs {
  [key: string]: SchemaSpec;
}

export interface Schema {
  name: string;
  datasource?: string; // for mapping model and handling controller
  prefix: string;
  methods: Array<string>;
  specs: SchemaSpecs;
}

export interface ApplicationDB {
  dbName: string;
  schemas: Array<Schema>;
}

export interface ModelSpec {
  model: mongoose.Model<any>;
  fields: string[];
  schema: Schema;
}

// key value pairs [ modelname - metadata ]
export interface ModelPool {
  [key: string]: ModelSpec;
}
