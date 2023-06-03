import { ModelPool, Schema } from 'core/constants';
import { Request, Response, NextFunction } from 'express';

export interface AppData {
  modelPool: ModelPool,
  current: string,
  fields: string[];
  schema: Schema;
}

export interface Req extends Request {
  appData: AppData;
  usr?: any; // TODO this is for user
}

export interface Res extends Response {}
export interface NextFunc extends NextFunction {}
