const express = require('express');
const app = express();
const cors = require('cors');
const port = 5001;
const routes = require('./routes/routes')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({storage: storage})

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(upload.single('image'))

require('./sqlConnections/sqlConnection')

app.use(routes)

app.get('/getImage/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'images', filename);
  
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
        // console.log('object')
      res.status(404).send('Image not found');
    }
} catch (error) {
    res.status(404).send('Something went Wrong');
}
})

app.listen(port, () => console.log('Server start on the port 5001'))