const express = require('express');
const bodyParser = require('body-parser');
const CSVGenerator = require('./utils/csvGenerator.js');
const csvGenerator = new CSVGenerator();

const app = express();
const port = 36;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/generate', async (req, res) => {
    const csvData = await csvGenerator.getCSV(req.body, req.query.rowsCount);
    console.log(req.query);
    res.set({
        'Content-type': 'text/csv',
        'Content-disposition': `attachment; filename=${req.query.fileName}.csv`
    }).send(csvData);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
