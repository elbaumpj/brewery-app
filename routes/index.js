const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  //res.send('waka flocka flayy');

  const peter = {name: 'Peter', age: 25, cool: true}
  //res.json(peter); 
  res.json(req.query); 
});

router.get('/reverse/:name', (req, res) => {

  //console.log([...req.params.name]); //spread operator, essentially the same as split(''); 
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});


module.exports = router;
