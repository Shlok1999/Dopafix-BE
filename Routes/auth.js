const express = require('express');
const { LoginUser,loginExternalUser,resetPassword } = require('../Controllers/AuthController');


const router = express.Router();



router.post('/google-auth', LoginUser);





module.exports = router;
