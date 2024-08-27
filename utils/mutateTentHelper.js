import Tent from '../models/TentModel.js';
import MutatedTent from '../models/MutatedTentModel.js';

export const createMutatedTentHelper = async (tentId, req, res) => {
    try {
        const originalTent = await Tent.findById(tentId);
        if (!originalTent) {
            throw new Error('Original tent not found');
        }

        const newTent = await MutatedTent.create({
            _id: undefined,
            ...originalTent._doc,
            originalTentId: originalTent._id
        });
        res.status(201).json(newTent);
        return newTent;
    } catch (error) {
        throw new Error(error.message);
    }
};