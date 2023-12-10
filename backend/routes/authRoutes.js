const { createUser, loginUserCtrl } = require('../controllers/userCtrl.js');
const router = require('express').Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);

module.exports = router;