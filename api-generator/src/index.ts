import { TestDB } from 'core/__test__/schema';
import { initModel } from 'core/model-generator';
import mongoose from 'mongoose';
import express from 'express';
import { registerController } from 'core/controller-generator';

const run = async () => {
  try {
    const testModelPool = initModel(TestDB);
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    const app = express();
    const router = express.Router();
    const getController = registerController(router, testModelPool);

    app.use(express.json());
    app.use(getController);
    app.listen(3000, () => console.log(3000));
  } catch (error) {
    console.error(error);
  }
};

run()
  .then()
  .catch((err) => console.log(err));
