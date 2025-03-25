import Tent from '../models/TentModel.js';

//GET ALL TENTS
export const getTents = async (req, res) => {
  try {
    const tents = await Tent.find();
    res.status(200).json(tents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//GET TENT DETAILS
export const getTent = async (req, res) => {
  const id = req.params.id;
  try {
    const tent = await Tent.findById(id);
    res.status(200).json(tent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const fetchTents = async (req, res) => {
  try {
    const tents = await Tent.find({ category: 'Tents' }).sort({ size: 1 });
    res.status(200).json(tents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get tent by category
export const getTentByCategory = async (req, res) => {
  const category = req.params.category;

  try {
    const tents = await Tent.find({ tentType: category }).sort({ size: 1 });
    res.status(200).json(tents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//update tent part
export const updateTentPart = async (req, res) => {
  const { id } = req.params;
  const { parts } = req.body;

  try {
    const tent = await Tent.findById(id);
    if (!tent) {
      return res.status(404).json({ message: 'Tent not found' });
    }

    tent.parts = parts;
    const updatedTent = await tent.save();

    // Emit event to clients in the specific room
    io.to(id).emit('tentUpdated', updatedTent);

    res.status(200).json(updatedTent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
