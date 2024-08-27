import fs from 'fs'

// Load the JSON file
const data = JSON.parse(fs.readFileSync('db.tents-w-complete.json', 'utf8'));

// Function to add "completedBy": null to each part
const addCompletedByField = (parts) => {
  return parts.map(part => ({
    ...part,
    completedBy: part.completedBy !== undefined ? part.completedBy : null
  }));
};

// Update each tent's parts
data.forEach(tent => {
  if (tent.parts) {
    tent.parts = addCompletedByField(tent.parts);
  }
});

// Save the updated JSON file to a new file
fs.writeFileSync('db.tents-w-complete-updated.json', JSON.stringify(data, null, 2), 'utf8');

console.log('Completed updating the JSON file.');