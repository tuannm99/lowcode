import { ApplicationDB, ModelPool } from 'core/constants';
import { ModelMapperType, Elasticsearch, Mongo, Redis } from './factory';

export const getModelPool = (applicationDb: ApplicationDB): ModelPool => {
    const { datasource } = applicationDb;

    const source = datasource ? datasource : 'mongo';
    const Model = _modelMapper[source];

    if (!Model) {
        throw new Error(`Unsupported data source: ${source}`);
    }

    return new Model(applicationDb).init();
};

const _modelMapper: ModelMapperType = {
    mongo: Mongo,
    elasticsearch: Elasticsearch,
    redis: Redis,
};
