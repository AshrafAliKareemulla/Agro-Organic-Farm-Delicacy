const express=require("express")
const app = express();
const router=express.Router();
const {registerUser, loginUser,logoutUser,getUser,getLoginStatus,updateUser, updatePhoto} =require("../controllers/userController")
const {protect}=require("../middleware/authMiddleware");
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'SomeKey',
  resave: false,
  saveUninitialized: true,
}));

const csrfProtection = csrf({ cookie: true });

// Add CSRF token to every response
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});


router.post("/register",registerUser,csrfProtection);
router.post("/login",loginUser,csrfProtection)
router.get("/logout",logoutUser);
router.get("/getuser",protect, getUser)
router.get("/getLoginStatus",getLoginStatus)
router.patch("/updateUser",protect,updateUser,csrfProtection)
router.patch("/updateUser",protect,updatePhoto,csrfProtection)

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      // CSRF token validation failed
      res.status(403).json({ error: 'Invalid CSRF token' });
    } else {
      next(err);
    }
  });
module.exports=router;