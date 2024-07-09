const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// Listen on port 6000
const port = 6000;

const secondAppPort = 7200;

app.listen(port, () => console.log('Container 1 listening for requests'));




const storeFile = (file, data, callback) => {



        /*CHANGE FILEPATH **/
    fs.appendFile(`/usr/src/app/data/${file}`, data, function (err) {
        /*CHANGE FILEPATH **/





        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

//Listening on POST requests on '/store-file'
app.post('/store-file',(req,res)=>{

const file=req.body.file;
const data=req.body.data;


//If filename is not provided, return error
    if(!file || file==''){
        return res.status(400).json({
            file: null,
            error: "Invalid JSON input."
        })
    }

        // Call storeFile function
        storeFile(file, data, (err) => {
            if (err) {
                res.status(500).json({
                        file: `${file}`,
                        error: "Error while storing the file to the storage."
                 });
            }
            res.status(200).json({
                file: `${file}`,
                message: "Success."
            });
        });
    });


// Listening for POST requests on /calculate
app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    // If the filename is not provided in JSON body
    if (!file || file === '') {
        return res.json({ file: null, error: "Invalid JSON input." });
    }

    // Send file and product to the second application
    try {
        const fetch = await import('node-fetch').then(mod => mod.default);

        // Send file and product to the second application



                             /*CHANGE URL **/
        const response = await fetch(`http://app2:${secondAppPort}/process`, {
                            /*CHANGE URL **/




                    
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file, product })
        });

        const data = await response.json();

        // Ensure the amount is returned as an integer
        if (data.sum !== undefined) {
            data.sum = parseInt(data.sum, 10);
        }

        // Send the response received from the second application back to the client
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

