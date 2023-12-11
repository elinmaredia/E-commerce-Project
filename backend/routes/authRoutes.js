const { 
    createUser, 
    loginUserCtrl, 
    getAllUsers, 
    getSingleUser, 
    deleteSingleUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout, 

} = require('../controllers/userCtrl.js');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware.js')
const router = require('express').Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/allUsers', getAllUsers);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteSingleUser);
router.put("/editUser", authMiddleware, updateUser);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser);
router.put('/refresh', handleRefreshToken);


module.exports = router;