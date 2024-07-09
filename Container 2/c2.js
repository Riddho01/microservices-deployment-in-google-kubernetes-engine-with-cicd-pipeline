const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const fs = require('fs');
const csv = require('csv-parser');

const port = 7200;

app.listen(port, () => console.log('Container 2 Listening for requests'));

app.post('/process', async (req, res) => {
    const { file, product } = req.body;

    // Check if the file exists in the mounted directory

      /*CHANGE FILEPATH **/
    const filePath = `/usr/src/app/data/${file}`;
    /*CHANGE FILEPATH **/





    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: "File not found." });
    }

    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            const trimmedData = {};
            for (const key in data) {
                const trimmedKey = key.trim();
                trimmedData[trimmedKey] = data[key].trim();
            }

            results.push(trimmedData);
        })
        .on('end', () => {
            if (results.length === 0 || !('product' in results[0]) || !('amount' in results[0])) {
                return res.status(400).json({ file, error: "Input file not in CSV format." });
            }
            const sum = results.reduce((acc, curr) => {
                if (curr.product === product) {
                    acc += parseInt(curr.amount, 10); // Ensure parseInt uses base 10
                }
                return acc;
            }, 0);

            // Return the sum as an integer
            res.status(200).json({ file, sum });
        });
});

