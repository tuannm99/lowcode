// Factory module that used for mapping Schema to Model
// base on its datasource (type)

import { ApplicationDB, ModelPool } from 'core/constants';
import mongoose from 'mongoose';
import { schemaAdapter } from './adapter';

export type ModelType = typeof Redis | typeof Elasticsearch | typeof Mongo;
export type ModelMapperType = Record<string, ModelType>;

export abstract class ModelCreator {
    constructor(private applicationDb: ApplicationDB) {}

    public init(): ModelPool {
        return this.modelFactory(this.applicationDb);
    }

    abstract modelFactory(applicationDb: ApplicationDB): ModelPool;
}

export class Mongo extends ModelCreator {
    modelFactory(applicationDb: ApplicationDB): ModelPool {
        const modelPool: ModelPool = {};
        for (const schema of applicationDb.schemas) {
            const { specs } = schema;

            const mapSchema: any = {};
            Object.entries(specs).forEach(([field, desc]) => {
                // TODO: need to update for creating index, validation, prehook, midleware, etc...
                mapSchema[field] = {
                    type: schemaAdapter(desc.type),
                    default: desc.default,
                };
            });

            const mongooseSchema = new mongoose.Schema(mapSchema);
            modelPool[schema.prefix] = {
                model: mongoose.model(schema.prefix, mongooseSchema),
                schema: schema,
                fields: Object.keys(specs),
            };
        }

        return modelPool;
    }
}

// for sql
export class Sequelize extends ModelCreator {
    modelFactory(): ModelPool {
        throw new Error('Method not implemented.');
    }
}

export class Redis extends ModelCreator {
    modelFactory(): ModelPool {
        throw new Error('Method not implemented.');
    }
}

export class Elasticsearch extends ModelCreator {
    modelFactory(): ModelPool {
        throw new Error('Method not implemented.');
    }
}

export class Cassandra extends ModelCreator {
    modelFactory(): ModelPool {
        throw new Error('Method not implemented.');
    }
}
