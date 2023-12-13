const express = require('express');
const cors = require('cors');
const { doAPICall, getFileLines } = require('./utils');

const app = express()

app.use(cors({origin: 'http://localhost:3000'}));

// Get all file names
app.get('/files/data', async (req, res) => {
    const response = await doAPICall('/secret/files');
    if (!response.files) return res.json([]);

    // Prepare the calls to get files' data and execute them
    const promises = response.files.map((file) => doAPICall(`/secret/file/${file}`));
    const fileList = await Promise.all(promises);
    
    // Format files' lines
    const result = fileList.reduce((acc, file, index) => {
        const lines = getFileLines(file);
        if (!lines) return acc;
        return [...acc, { file: response.files[index], lines }]
    }, []);

    // Return an array with objects with the filename and its lines
    return res.json(result);
});

// Get an specific file with its data
app.get('/files/data/:fileName', async (req, res) => {
    // Get the file
    const fileName = req.url.split('/')[3];
    const file = await doAPICall(`/secret/file/${fileName}`);

    // Format its lines
    const lines = getFileLines(file);

    // Return an array with an object with the filename and its lines
    return res.json([{
        file: fileName,
        lines: lines || []
    }]);
});

// Get the list of files
app.get('/files/list', async (req, res) => {
    const response = await doAPICall('/secret/files')
    return res.json(response);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});