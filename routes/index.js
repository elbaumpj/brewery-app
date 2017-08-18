const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('waka flocka flayy');
});


module.exports = router;
