const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('scripts'));
app.use(express.json({ limit: '550mb' }));
app.use(express.urlencoded({ limit: '550mb' }));

app.post('/upload', (req, res) => {
    const { fileName, data } = req.body;
    try {
        fs.writeFile(`./scripts/${fileName}.json`, JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log('complete');
        });
        return res.sendStatus(200).send('data Found');
    } catch (error) {
        return res.status(404).send('Not Found');
    }
});

app.listen(8000, () => {
    console.log('App is running on port 8000')
});