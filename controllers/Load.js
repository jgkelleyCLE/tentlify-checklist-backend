import Load from "../models/LoadModel.js";
import { createMutatedTentHelper } from "../utils/mutateTentHelper.js";
import { createMutatedTent } from "./MutatedTent.js";
import MutatedTent from "../models/MutatedTentModel.js";
import Tent from "../models/TentModel.js";

//GET ALL LOADS
export const getLoads = async(req, res) => {

    try {
        
        const loads = await Load.find()
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password')
        .sort({ createdAt: -1 })
        res.status(200).json(loads)

    } catch (error) {
        res.status(400).json({ message: error.message })    
    }

}

//get users loads
export const getUsersLoads = async(req, res) => {

    const userId = req.user.id

    try {
        const loads = await Load.find({
            $or: [
                { users: userId },
                { groupAdmin: userId }
            ]
        })
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password')
        .sort({ createdAt: -1 })
        res.status(200).json(loads)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

//get loads by admin
export const getAdminLoads = async(req, res) => {

    try {
        
        const loads = await Load.find({ groupAdmin: req.user.id })
        .populate('users', '-password')
        .populate('tents')
        .populate('groupAdmin', '-password')
        .sort({ createdAt: -1 })
        res.status(200).json(loads)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}



//get single load
export const getLoad = async(req, res) => {

    const id = req.params.id

    try {
        
        const load = await Load.findById(id)
        .populate('users', '-password')
        .populate('tents')
        .populate({
            path: 'tents',
            populate: {
                path: 'parts.completedBy',
                select: '-password'
            }
        })
        .populate('groupAdmin', '-password')

        res.status(200).json(load)  

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

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
            groupAdmin: req.user.id
        };

        console.log("LOAD DATA: ", loadData)

        const newLoad = await Load.create(loadData);

        // const fullLoad = await Load.findById(newLoad._id)
        //     .populate('users', '-password')
        //     .populate('tents')
        //     .populate('groupAdmin', '-password');

        //     console.log("FULL LOAD: ", fullLoad)

        // res.status(201).json(fullLoad);
        res.status(201).json(newLoad)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//add user to load
export const addUserToLoad = async(req, res) => {
    
        const { userId } = req.body
        const loadId = req.params.id
    
        try {
            
            const load = await Load.findById(id)
    
            if(load.groupAdmin.toString() === req.user.id.toString()){
                const updatedLoad = await Load.findByIdAndUpdate(
                    loadId,
                    { $push: { users: userId } },
                    { new: true }
                )
                .populate('users', '-password')
                .populate('tents')
                .populate('groupAdmin', '-password')
            
    
                res.status(200).json(updatedLoad)
            }
        } catch(error){
            res.status(400).json({ message: error.message })
        }
}

//remove user from load
export const removeUserFromLoad = async(req, res) => {

    const { userId } = req.body
    const loadId = req.params.id

    try {
        
        const load = await Load.findById(id)

        if(load.groupAdmin.toString() === req.user.id.toString()){
            const updatedLoad = await Load.findByIdAndUpdate(
                loadId,
                { $pull: { users: userId } },
                { new: true }
            )
            .populate('users', '-password')
            .populate('tents')
            .populate('groupAdmin', '-password')
        

            res.status(200).json(updatedLoad)
        }
    } catch(error){
        res.status(400).json({ message: error.message })
    }

}

//add tent to load -- WITHOUT MUTATION
// export const addTentToLoad = async(req, res) => {

//     const { tentId } = req.body
//     const loadId = req.params.id

//     try {
        
//         const load = await Load.findById(id)

//         if(load.groupAdmin.toString() === req.user.id.toString()){
//             const updatedLoad = await Load.findByIdAndUpdate(
//                 loadId,
//                 { $push: { tents: tentId } },
//                 { new: true }
//             )
//             .populate('users', '-password')
//             .populate('tents')
//             .populate('groupAdmin', '-password')
        

//             res.status(200).json(updatedLoad)
//         }
//     } catch(error){
//         res.status(400).json({ message: error.message })
//     }

// }

//ADD MUTATED TENT TO LOAD
// export const addTentToLoad = async (req, res) => {
//     const { tentId } = req.body;
//     const loadId = req.params.id;

//     try {
//         // Create a new mutated tent
//         const newMutatedTent = await createMutatedTentHelper(tentId);

//         // Fetch the load
//         const load = await Load.findById(loadId);

//         if (load.groupAdmin.toString() === req.user.id.toString()) {
//             // Add the new mutated tent to the load
//             const updatedLoad = await Load.findByIdAndUpdate(
//                 loadId,
//                 { $push: { tents: newMutatedTent._id } },
//                 { new: true }
//             )
//             .populate('users', '-password')
//             .populate('tents')
//             .populate('groupAdmin', '-password');

//             res.status(200).json(updatedLoad);
//         } else {
//             res.status(403).json({ message: 'Unauthorized' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

//add tent to load -- WITH MUTATION
export const addTentToLoad = async (req, res) => {
    const { tentId } = req.body;
    const loadId = req.params.id;

    console.log("TENT ID being mutated: ", tentId)

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
            originalTentId: originalTent._id
        })
        res.status(201).json(newTent)

        console.log("NEW TENT: ", newTent)

        // Fetch the load
        const load = await Load.findById(loadId);

        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        if (load.groupAdmin.toString() === req.user.id.toString()) {
            // Add the new mutated tent to the load
            const updatedLoad = await Load.findByIdAndUpdate(
                loadId,
                { $push: { tents: newTent._id } },
                { new: true }
            )
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
export const removeTentFromLoad = async(req, res) => {

    const { tentId } = req.body
    const loadId = req.params.id

    try {
        
        const load = await Load.findById(id)

        if(load.groupAdmin.toString() === req.user.id.toString()){
            const updatedLoad = await Load.findByIdAndUpdate(
                loadId,
                { $pull: { tents: tentId } },
                { new: true }
            )
            .populate('users', '-password')
            .populate('tents')
            .populate('groupAdmin', '-password')
        

            res.status(200).json(updatedLoad)
        }
    } catch(error){
        res.status(400).json({ message: error.message })
    }

}

//update load with users, tents, name
// export const updateLoad = async(req, res) => {

//     const { title, users, tents } = req.body
//     const id = req.params.id

//     try {
        
//         const load = await Load.findById(id)

//         if(load.groupAdmin.toString() === req.user.id.toString()){
//             const updatedLoad = await Load.findByIdAndUpdate(
//                 id,
//                 { title, users, tents },
//                 { new: true }
//             )
//             .populate('users', '-password')
//             .populate('tents')
//             .populate('groupAdmin', '-password')
        

//             res.status(200).json(updatedLoad)
//         }
//     } catch(error){
//         res.status(400).json({ message: error.message })
//     }

// }

//update load with mutation
// export const updateLoad = async (req, res) => {
//     const { title, users, tents } = req.body;
//     const id = req.params.id;

//     try {
//         const load = await Load.findById(id);

//         if (load.groupAdmin.toString() === req.user.id.toString()) {
//             // Fetch and mutate each tent
//             const mutatedTents = await Promise.all(tents.map(async (tentId) => {
//                 const originalTent = await Tent.findById(tentId);

//                 if (!originalTent) {
//                     throw new Error(`Tent with ID ${tentId} not found`);
//                 }


//                 // const newTent = await MutatedTent.create({
//                 //     _id: undefined,
//                 //     ...originalTent._doc,
//                 //     originalTentId: originalTent._id
//                 // })
//                 // res.status(201).json(newTent)

//                 // Create a mutated tent based on the original tent
//                 const mutatedTent = new MutatedTent({
//                     // _id: undefined,
//                     ...originalTent._doc,
//                     originalTentId: originalTent._id
//                     // mutated: true // Example mutation
//                 });

//                 // Save the mutated tent to the database
//                 const savedMutatedTent = await mutatedTent.save();
//                 return savedMutatedTent._id;
//             }));

//             // Update the load with the mutated tents
//             const updatedLoad = await Load.findByIdAndUpdate(
//                 id,
//                 { title, users, tents: mutatedTents },
//                 { new: true }
//             )
//             .populate('users', '-password')
//             .populate('tents')
//             .populate('groupAdmin', '-password');

//             res.status(200).json(updatedLoad);
//         } else {
//             res.status(403).json({ message: 'Unauthorized' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

export const updateLoad = async (req, res) => {
    const { title, users, tents } = req.body;
    const id = req.params.id;

    try {
        const load = await Load.findById(id);

        if (load.groupAdmin.toString() === req.user.id.toString()) {
            // Fetch and mutate each tent
            const mutatedTents = await Promise.all(tents.map(async (tentId) => {
                const originalTent = await Tent.findById(tentId);

                if (!originalTent) {
                    throw new Error(`Tent with ID ${tentId} not found`);
                }

                // Remove the _id field from the original tent object
                const { _id, ...tentData } = originalTent.toObject();

                // Create a mutated tent based on the original tent
                const mutatedTent = new MutatedTent({
                    ...tentData,
                    originalTentId: originalTent._id
                });

                // Save the mutated tent to the database
                const savedMutatedTent = await mutatedTent.save();
                return savedMutatedTent._id;
            }));

            // Update the load with the mutated tents
            const updatedLoad = await Load.findByIdAndUpdate(
                id,
                { title, users, tents: mutatedTents },
                { new: true }
            )
            .populate('users', '-password')
            // .populate('tents')
            .populate({
                path: 'tents',
                model: 'MutatedTent'
            })
            .populate('groupAdmin', '-password');

            res.status(200).json(updatedLoad);
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete load
export const deleteLoad = async(req, res) => {

    const id = req.params.id

    console.log("ID: ", id)

    try {
        
        const load = await Load.findByIdAndDelete(id)
        res.status(200).json(load)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

// export const deactivateLoad = async(req, res) => {

//     const id = req.params.id
//     console.log("DEACTIVATING LOAD: ", id)

//     try {
        
//         const load = await Load.findByIdAndUpdate(id, { active: false }, { new: true })

//         console.log("DEACTIVATED LOAD: ", load)
//         res.status(200).json(load)
//     } catch (error) {
//         res.status(400).json({ message: error.message })
//     }

// }

export const deactivateLoad = async (req, res) => {
    const id = req.params.id;
    console.log("DEACTIVATING LOAD: ", id);

    try {
        const load = await Load.findByIdAndUpdate(
            id,
            { $set: { active: false } },
            { new: true }
        );

        console.log("DEACTIVATED LOAD: ", load);
        res.status(200).json(load);
    } catch (error) {
        console.error("Error deactivating load:", error);
        res.status(400).json({ message: error.message });
    }
};

export const activateLoad = async(req, res) => {

    const id = req.params.id

    try {
        
        const load = await Load.findByIdAndUpdate(id, { active: true }, { new: true })
        res.status(200).json(load)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}
