const express = require('express');
const cors = require('cors');
const { doAPICall, getFileLines } = require('./utils');

const app = express()

app.use(cors());

app.get('/files/data', async (req, res) => {
    const response = await doAPICall('/secret/files');
    const promises = response.files.map((file) => doAPICall(`/secret/file/${file}`));
    const fileList = await Promise.all(promises);
    
    const result = fileList.reduce((acc, file, index) => {
        const lines = getFileLines(file);
        if (!lines) return acc;
        return [...acc, { file: response.files[index], lines }]
    }, []);

    return res.json(result);
});

app.get('/files/data/:fileName', async (req, res) => {
    const fileName = req.url.split('/')[3];
    const file = await doAPICall(`/secret/file/${fileName}`);

    const lines = getFileLines(file);
    return res.json({
        file: fileName,
        lines
    });
});

app.get('/files/list', async (req, res) => {
    const response = await doAPICall('/secret/files')
    return res.json(response);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});