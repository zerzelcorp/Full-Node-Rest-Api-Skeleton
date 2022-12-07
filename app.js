const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileStore = require("session-file-store");
const passport = require('passport')
const authenticate = require('./authenticate')
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const User = require("./models/User");
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const PORT = 3000 || PORT.env;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//APP LEVEL MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("123456-45646-67678"));

app.use(
  session({
    name: "session-id",
    secret: Math.random(100 * 100),
    saveUnitalized: "false",
    resave: false,
    store: new fileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());
function auth (req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
        next();
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/", (req, res, next) => {
  res.send("index", {
    title: "Express",
    cookies: req.cookies,
    signedcookies: req.signedCookies,
    cookie: { secure: true },
  });
});
app.use("/dishes", require("./routes/dishRouter"));
app.use("/", require("./routes/promoRouter"));
app.use("/", require("./routes/leaderRouter"));
app.use("/", require("./routes/userRouter"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
//PASSPORT CONFIG
passport.use(new LocalStrategy((username,password,done)=>{
  User.findOne({username:username},(err,user)=>{
    if(err){return done(err)}
    if(!user) {return done(null,false)}
    if(!user.verifyPassword(password)){return done(null,false)}
    return done(null,user)
  })
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//INIT SERVER
app.listen(PORT, () => {
  mongoose.connect("mongodb://localhost:27017/coursera-week2",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log(`Server started on http://localhost:${PORT} and 🍃 DB connected!`)
})
.catch(e=>console.log(e))
});

module.exports = app;
