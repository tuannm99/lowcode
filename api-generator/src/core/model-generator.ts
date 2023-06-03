// TODO - co the su dung adapter & strategy pattern
// sau nay co the can tao model dua tren tung loai database nhu: 
// - mongo (*), sql, cassandra, elasticsearch, redis

import mongoose from 'mongoose';
import { DATA_TYPE, ApplicationDB, ModelPool, Schema } from './constants';

const schemaAdapter = (dataType: string, datasource?: string) => {
  switch (dataType) {
    case DATA_TYPE.OBJECT_ID:
      return mongoose.Types.ObjectId;
    case DATA_TYPE.STRING:
      return String;
    case DATA_TYPE.NUMBER:
      return Number;
    case DATA_TYPE.BOOLEAN:
      return Boolean;
    case DATA_TYPE.DATE:
      return Date;
    default:
      return String;
  }
};

export const generateModelFromSchema = (schema: Schema) => {
  const { specs } = schema;

  const mapSchema: any = {};
  Object.entries(specs).forEach(([field, desc]) => {
    // chua tinh den index, validation, hook ....
    mapSchema[field] = {
      type: schemaAdapter(desc.type),
      default: desc.default,
    };
  });

  const mongooseSchema = new mongoose.Schema(mapSchema);

  return {
    model: mongoose.model(schema.prefix, mongooseSchema),
    schema: schema,
    fields: Object.keys(specs),
  };
};

export const initModel = (applicationDb: ApplicationDB): ModelPool => {
  const modelPool: ModelPool = {};
  for (const schema of applicationDb.schemas) {
    modelPool[schema.prefix] = generateModelFromSchema(schema);
  }

  return modelPool;
};
