import { Router } from 'express';
import Bluebird from 'bluebird';
import { ModelPool, ACTION_TO_METHOD } from 'core/constants';
import { AppData, NextFunc, Req, Res } from './web';

const getHandler = async (req: Req, res: Res) => {
    try {
        const { current, modelPool, fields, schema } = req.appData;
        const Model = modelPool[current].model;

        const { sortBy, page, limit, pickFields } = req.query;
        const query = {};
        const projection = {}; // convert from selection

        if (pickFields && typeof pickFields === 'string') {
            const seletectedFields = pickFields.split(',');
            for (const field of seletectedFields) {
                (projection as Record<string, number>)[field] = 1;
            }
        }

        const limitValid = limit ? Number(limit) : 10;
        const skipValid = page ? (Number(page) - 1) * Number(limitValid) : 0;
        const find = Model.find(query, projection)
            .skip(skipValid)
            .limit(limitValid)
            .sort(sortBy ? String(sortBy) : 'asc')
            .lean();

        const count = Model.count(query);
        const [datas, total] = await Bluebird.all([find, count]);

        res.status(200).send({
            data: datas,
            status: 200,
            pagination: { total, page: 1 },
        });
    } catch (error) {
        res.status(400).send({ error, status: 400 });
    }
};

const getByIdHandler = async (req: Req, res: Res) => {
    try {
        const { current, modelPool, fields, schema } = req.appData;
        const Model = modelPool[current].model;
        const find = await Model.findById(req.params.id).lean();
        if (!find) {
            return res.status(404).send({ error: 'not found', status: 404 });
        }

        res.status(200).send({ data: find, status: 200 });
    } catch (error) {
        res.status(400).send({ error, status: 400 });
    }
};

const createHandler = async (req: Req, res: Res) => {
    try {
        const { current, modelPool } = req.appData;
        const Model = modelPool[current].model;
        const modelPayload: Record<string, any> = {};
        Object.entries(req.body).forEach(([key, value]) => {
            modelPayload[key] = value;
        });

        const data = new Model(modelPayload);
        const saved = await data.save();

        res.status(201).send({ data: saved, status: 201 });
    } catch (error) {
        res.status(400).send({ error, status: 400 });
    }
};

// const putHandler = async (req: Req, res: Res) => {};

// const deleteHandler = async (req: Req, res: Res) => {};

// const deleteByIdHandler = async (req: Req, res: Res) => {};

// TODO - using command pattern for specific handler per api
export const commonHandler = new Map();
commonHandler.set('createHandler', createHandler);

commonHandler.set('getHandler', getHandler);
commonHandler.set('getByIdHandler', getByIdHandler);

// commonHandler.set('postHandler', postHandler);
// commonHandler.set('updateHandler', postHandler);

const commonMiddleware =
    (appData: AppData) => (req: Req, res: Res, next: NextFunc) => {
        req.appData = appData;
        next();
    };

export const registerController = (router: Router, modelPool: ModelPool) => {
    Object.entries(modelPool).forEach(([field, modelSpec]) => {
        const { schema, fields } = modelSpec;
        const { methods, prefix } = schema;

        for (const action of methods) {
            const method: string = (ACTION_TO_METHOD as any)[action];
            (router as any)[method](
                `/${prefix}${action.includes('IdHandler') ? '/:id' : ''}`,
                commonMiddleware({
                    modelPool,
                    current: prefix,
                    schema,
                    fields,
                }),
                commonHandler.get(action)
            );
        }
    });
    return router;
};
