import mongoose from 'mongoose';
import { DATA_TYPE } from 'core/constants';

// TODO: create adapter for others datasource
// Now its only create for mongodb by using Mongoose ODM
// make it class and using SOLID

export const schemaAdapter = (dataType: string, datasource?: string) => {
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
