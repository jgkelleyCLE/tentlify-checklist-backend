import MutatedTent from "../models/MutatedTentModel.js";
import Tent from "../models/TentModel.js";

//create new MutatedTent
export const createMutatedTent = async(req, res) => {

    const id = req.params.id

    try {
        
        const originalTent = await Tent.findById(id)
        if (!originalTent) {
            return res.status(404).json({ message: 'Original tent not found' });
        }

        const newTent = await MutatedTent.create({
            _id: undefined,
            ...originalTent._doc,
            originalTentId: originalTent._id
        })
        res.status(201).json(newTent)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

}



//update mutated Tent part
export const updateMutatedTentPart = async (req, res) => {
    const tentId = req.params.id;
    const { partId, updatedPart } = req.body;


    try {
        const tent = await MutatedTent.findById(tentId).populate('parts.completedBy', 'username image');
        if (!tent) {
            return res.status(404).json({ message: 'Tent not found' });
        }

        // Find the part to update
        const partIndex = tent.parts.findIndex(part => part._id.toString() === partId);
        if (partIndex === -1) {
            return res.status(404).json({ message: 'Part not found' });
        }

        // Update the specific part
        tent.parts[partIndex] = { ...tent.parts[partIndex], ...updatedPart };
        const updatedTent = await tent.save();

        // Emit event to clients in the specific room
        // io.to(tentId).emit('tentUpdated', updatedTent);

        res.status(200).json(updatedTent);
    } catch (error) {
        console.error("Error updating part: ", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//get mutated tent
export const getMutatedTent = async(req, res) => {

    const id = req.params.id


    try {
        
        const mutatedTent = await MutatedTent.findById(id).populate('parts.completedBy', 'username image');

        if(!mutatedTent){
            return res.status(404).json({ message: 'Tent not found' });
        }
        res.status(200).json(mutatedTent)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

}