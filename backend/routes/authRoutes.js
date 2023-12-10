const { 
    createUser, 
    loginUserCtrl, 
    getAllUsers, 
    getSingleUser, 
    deleteSingleUser,
    updateUser, 

} = require('../controllers/userCtrl.js');
const router = require('express').Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/allUsers', getAllUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteSingleUser);
router.put("/:id", updateUser);

module.exports = router;