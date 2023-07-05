import { TestDB } from 'core/__test__/schema';
import mongoose from 'mongoose';
import express from 'express';
import { registerController } from 'core/controller';
import { getModelPool } from 'core/model';

const run = async () => {
    try {
        const testModelPool = getModelPool(TestDB);
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        const app = express();
        const router = express.Router();
        const controller = registerController(router, testModelPool);

        app.use(express.json());
        app.use(controller);
        app.listen(3000, () => console.log('App listion on: ', 3000));
    } catch (error) {
        console.error(error);
    }
};

run()
    .then()
    .catch((err) => console.log(err));
