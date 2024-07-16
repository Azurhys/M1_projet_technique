const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:imageName', (req, res) => {
    let imageName = req.params.imageName;
    let absolutePath = path.resolve(__dirname, '../images', imageName);
    res.sendFile(absolutePath);
});


module.exports = router;