const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin:'*'
}));
const path = require('path');
app.use('/postImages', express.static(path.join(__dirname, 'public/postImages')));

const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/React_Backend");

const post_route = require('./routes/postRoute');
app.use('/api',post_route);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});