import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Path to your original JSON file
const filePath = './db.tents-w-complete-updated.json';

// Path to the new JSON file
const newFilePath = './db.tents-w-complete-updated-with-ids.json';

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Parse the JSON data
    let tents = JSON.parse(data);

    // Iterate through each tent and assign a unique _id to each part
    tents.forEach(tent => {
        if (tent.parts) {
            tent.parts = tent.parts.map(part => ({
                ...part,
                _id: uuidv4(),
            }));
        }
    });

    // Convert the updated object back to JSON
    const updatedData = JSON.stringify(tents, null, 2);

    // Write the updated JSON to the new file
    fs.writeFile(newFilePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File successfully saved with unique _id for each part.');
    });
});