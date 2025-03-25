import User from '../models/UserModel.js';
import Tent from '../models/TentModel.js';
// import { generateToken } from "../middleware/generateToken.js";

//get all users
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // Assuming the logged-in user's ID is stored in req.user.id
    // const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get user
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//add tent to favorites
export const addTentToFavorites = async (req, res) => {
  const { tentId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tent = await Tent.findById(tentId);
    if (!tent) {
      return res.status(404).json({ message: 'Tent not found' });
    }

    if (user.favorites.includes(tentId)) {
      return res.status(400).json({ message: 'Tent already in favorites' });
    } else {
      await User.updateOne({ _id: userId }, { $set: { favorites: [...user.favorites, tentId] } });
      const updatedUser = await User.findById(userId);
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//add tent to favorites
export const removeTentFromFavorites = async (req, res) => {
  const { tentId } = req.body;

  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(tentId)) {
      return res.status(404).json({ message: 'Tent not found in favorites' });
    }

    await User.updateOne({ _id: userId }, { $pull: { favorites: tentId } });

    const updatedUser = await User.findById(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get user favorites
export const getUserFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user.favorites);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//edit user info
export const editUser = async (req, res) => {
  const { username, image } = req.body;

  const userId = req.user.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: username,
          image: image,
        },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
