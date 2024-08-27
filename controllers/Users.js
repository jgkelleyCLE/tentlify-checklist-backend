import User from "../models/UserModel.js";

//get all users
export const getUsers = async(req, res) => {

    try {
        const loggedInUserId = req.user.id; // Assuming the logged-in user's ID is stored in req.user.id
        // const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}