import Load from '../models/LoadModel.js';
import { createMutatedTentHelper } from '../utils/mutateTentHelper.js';
import { createMutatedTent } from './MutatedTent.js';
import MutatedTent from '../models/MutatedTentModel.js';
import Tent from '../models/TentModel.js';
import MutatedTable from '../models/MutatedTableModel.js';
import MutatedChair from '../models/MutatedChairModel.js';

//GET ALL LOADS
export const getLoads = async (req, res) => {
  try {
    const loads = await Load.find()
      .populate('users', '-password')
      .populate('tents')
      .populate('groupAdmin', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(loads);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get users loads
export const getUsersLoads = async (req, res) => {
  const userId = req.user.id;

  try {
    const loads = await Load.find({
      $or: [{ users: userId }, { groupAdmin: userId }],
    })
      .populate('users', '-password')
      .populate('tents')
      .populate('groupAdmin', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(loads);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get loads by admin
export const getAdminLoads = async (req, res) => {
  try {
    const loads = await Load.find({ groupAdmin: req.user.id })
      .populate('users', '-password')
      .populate('tents')
      .populate('groupAdmin', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(loads);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get single load
export const getLoad = async (req, res) => {
  const id = req.params.id;

  try {
    const load = await Load.findById(id)
      .populate('users', '-password')
      .populate('tents')
      .populate({
        path: 'tents',
        populate: {
          path: 'parts.completedBy',
          select: '-password',
        },
      })
      .populate('groupAdmin', '-password');

    res.status(200).json(load);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//CREATE LOAD
// export const createLoad = async(req, res) => {

//     const { title, users, tents, groupAdmin } = req.body

//     try {

//         const loadData = {
//             title,
//             users: [...users, req.user.id],
//             tents,
//             groupAdmin: req.user.id
//         }

//         const newLoad = Load.create(loadData)

//         const fullLoad = await Load.findById(newLoad._id)
//         .populate('users', '-password')
//         .populate('tents')
//         .populate('groupAdmin', '-password')

//         res.status(201).json(fullLoad)

//     } catch (error) {
//         res.status(400).json({ message: error.message })
//     }

// }

//create load with only admin
export const createLoad = async (req, res) => {
  // const { groupAdmin } = req.body;

  try {
    const loadData = {
      groupAdmin: req.user.id,
      // loadType: 1
    };

    console.log('LOAD DATA: ', loadData);

    const newLoad = await Load.create(loadData);

    res.status(201).json(newLoad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//add user to load
export const addUserToLoad = async (req, res) => {
  const { userId } = req.body;
  const loadId = req.params.id;

  try {
    const load = await Load.findById(id);

    if (load.groupAdmin.toString() === req.user.id.toString()) {
      const updatedLoad = await Load.findByIdAndUpdate(loadId, { $push: { users: userId } }, { new: true })
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password');

      res.status(200).json(updatedLoad);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//remove user from load
export const removeUserFromLoad = async (req, res) => {
  const { userId } = req.body;
  const loadId = req.params.id;

  try {
    const load = await Load.findById(id);

    if (load.groupAdmin.toString() === req.user.id.toString()) {
      const updatedLoad = await Load.findByIdAndUpdate(loadId, { $pull: { users: userId } }, { new: true })
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password');

      res.status(200).json(updatedLoad);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//add tent to load -- WITH MUTATION
export const addTentToLoad = async (req, res) => {
  const { tentId } = req.body;
  const loadId = req.params.id;

  try {
    // Fetch the original tent
    const originalTent = await Tent.findById(tentId);

    if (!originalTent) {
      return res.status(404).json({ message: 'Tent not found' });
    }

    // Create a mutated tent based on the original tent
    const newTent = await MutatedTent.create({
      _id: undefined,
      ...originalTent._doc,
      originalTentId: originalTent._id,
    });
    res.status(201).json(newTent);

    // Fetch the load
    const load = await Load.findById(loadId);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    if (load.groupAdmin.toString() === req.user.id.toString()) {
      // Add the new mutated tent to the load
      const updatedLoad = await Load.findByIdAndUpdate(loadId, { $push: { tents: newTent._id } }, { new: true })
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password');

      res.status(200).json(updatedLoad);
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//remove tent from load
export const removeTentFromLoad = async (req, res) => {
  const { tentId } = req.body;
  const loadId = req.params.id;

  try {
    const load = await Load.findById(id);

    if (load.groupAdmin.toString() === req.user.id.toString()) {
      const updatedLoad = await Load.findByIdAndUpdate(loadId, { $pull: { tents: tentId } }, { new: true })
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password');

      res.status(200).json(updatedLoad);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createLoadFromOrder = async (req, res) => {
  const { order } = req.body;
  const id = req.params.id;

  try {
    // Check if a load with the given order ID already exists
    const existingLoad = await Load.findOne({ orderId: order._id });
    if (existingLoad) {
      return res.status(200).json(existingLoad);
    }

    // Fetch and mutate each tent
    const mutatedTents = await Promise.all(
      order.orderItems.map(async (item) => {
        const { tentId, cartQuantity } = item;
        const originalTent = await Tent.findById(item._id);

        // if (!originalTent) {
        //     throw new Error(`Tent with ID ${tentId} not found`);
        // }

        // Remove the _id field from the original tent object
        const { _id, ...tentData } = originalTent.toObject();

        // Create a mutated tent based on the original tent
        const mutatedTent = new MutatedTent({
          ...tentData,
          cartQuantity,
          originalTentId: originalTent._id,
        });

        // Save the mutated tent to the database
        const savedMutatedTent = await mutatedTent.save();
        return savedMutatedTent._id;
      })
    );

    // Create a new load with the mutated tents, tables, and chairs
    const newLoad = await Load.create({
      title: order.title,
      users: req.user.id,
      tents: mutatedTents,
      // tables: mutatedTables,
      // chairs: mutatedChairs,
      groupAdmin: '66ed7fedf802032033a4337a', // admin's ID
      orderId: order._id,
      eventDate: order.eventDate,
      cartQuantity: order.cartQuantity,
      loadType: 2,
    });

    res.status(201).json(newLoad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLoad = async (req, res) => {
  const { title, users, tents } = req.body;
  const id = req.params.id;

  try {
    const load = await Load.findById(id);

    if (!load) {
      console.log('LOAD NOT FOUND');
      return res.status(404).json({ message: 'Load not found' });
    }

    if (load.groupAdmin.toString() === req.user.id.toString()) {
      // Fetch and mutate each tent
      const mutatedTents = await Promise.all(
        tents.map(async (tentId) => {
          const originalTent = await Tent.findById(tentId);

          if (!originalTent) {
            throw new Error(`Tent with ID ${tentId} not found`);
          }

          // Remove the _id field from the original tent object
          const { _id, ...tentData } = originalTent.toObject();

          // Create a mutated tent based on the original tent
          const mutatedTent = new MutatedTent({
            ...tentData,
            originalTentId: originalTent._id,
          });

          // Save the mutated tent to the database
          const savedMutatedTent = await mutatedTent.save();
          return savedMutatedTent._id;
        })
      );

      // Update the load with the mutated tents
      const updatedLoad = await Load.findByIdAndUpdate(
        id,
        { title, users, tents: mutatedTents, groupAdmin: '66ed7fedf802032033a4337a' },
        { new: true }
      )
        .populate('users', '-password')
        // .populate('tents')
        .populate({
          path: 'tents',
          model: 'MutatedTent',
        });
      // .populate('groupAdmin', '-password');

      res.status(200).json(updatedLoad);
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createdMutatedTent = async (req, res) => {
  const { tents } = req.body;

  const id = req.params.id;

  // Fetch and mutate each tent
  const mutatedTents = await Promise.all(
    tents.map(async (tentId) => {
      const originalTent = await Tent.findById(tentId);

      if (!originalTent) {
        throw new Error(`Tent with ID ${tentId} not found`);
      }

      // Remove the _id field from the original tent object
      const { _id, ...tentData } = originalTent.toObject();

      // Create a mutated tent based on the original tent
      const mutatedTent = new MutatedTent({
        ...tentData,
        originalTentId: originalTent._id,
      });

      // Save the mutated tent to the database
      const savedMutatedTent = await mutatedTent.save();
      return savedMutatedTent._id;
    })
  );

  // Update the load with the mutated tents
  // const updatedLoad = await Load.findByIdAndUpdate(
  //     id,
  //     { title, users, tents: mutatedTents },
  //     { new: true }
  // )
  // // .populate('users', '-password')
  // // .populate('tents')
  // .populate({
  //     path: 'tents',
  //     model: 'MutatedTent'
  // })

  // res.status(200).json(updatedLoad);
};

//delete load
export const deleteLoad = async (req, res) => {
  const id = req.params.id;

  try {
    const load = await Load.findByIdAndDelete(id);
    res.status(200).json(load);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deactivateLoad = async (req, res) => {
  const id = req.params.id;

  try {
    const load = await Load.findByIdAndUpdate(id, { $set: { active: false } }, { new: true });

    res.status(200).json(load);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const activateLoad = async (req, res) => {
  const id = req.params.id;

  try {
    const load = await Load.findByIdAndUpdate(id, { $set: { active: true } }, { new: true });
    res.status(200).json(load);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
