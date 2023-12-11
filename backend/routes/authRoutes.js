const { 
    createUser, 
    loginUserCtrl, 
    getAllUsers, 
    getSingleUser, 
    deleteSingleUser,
    updateUser,
    blockUser,
    unblockUser, 

} = require('../controllers/userCtrl.js');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware.js')
const router = require('express').Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/allUsers', getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteSingleUser);
router.put("/editUser", authMiddleware, updateUser);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;