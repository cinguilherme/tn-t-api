// src/routes/userRouter.ts
import { randomUUID } from 'crypto';
import express from 'express';
import { BuildUserQueryParams, createUser, deleteUserById, getUserById, getUsers, updateUser } from '../db/userQueries';
import { validate } from '../middleware/validationMiddleware';
import { User } from '../models/User';
import { newUserSchema, userUpdateSchema } from '../validators/userValidator';

const router = express.Router();

router.post('/', validate(newUserSchema), async (req, res) => {
  
  try {
    const newUser: User = {
      ...req.body,
      id: randomUUID(),
    };
    const createdUser = await createUser(newUser);
    res.status(201).send(createdUser);
  } catch (error) {
    res.status(500).send({ error: 'Error creating user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const queryParams: BuildUserQueryParams = {
      status: req.query.status as string,
      username: req.query.username as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      exclusiveStartKey: req.query.exclusiveStartKey as string,
    };
    const { users, lastEvaluatedKey } = await getUsers(queryParams);
    res.status(200).send({ users, lastEvaluatedKey });
  } catch (error) {
    res.status(500).send({ error: 'Error getting users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error getting user' });
  }
});

router.put('/:id', validate(userUpdateSchema), async (req, res) => {
  try {
    const updatedUser = await updateUser(req.body);
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error updating user' });
  }

});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await deleteUserById(userId);
    if (deletedUser) {
      res.status(200).send(deletedUser);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error deleting user' });
  }
});

export default router;
