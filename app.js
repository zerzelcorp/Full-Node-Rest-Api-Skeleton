const createError = require("http-errors");
const express = require("express");
const path = require("path");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const fileStore = require("session-file-store");
const mongoose = require("mongoose");
const passport = require("passport");
const authenticate = require("./authenticate");
const config = require("./config");
const logger = require("morgan");
// const cors = require("cors");

const helmet = require("helmet");
const User = require("./models/User");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const PORT = 3444 || PORT.env;
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// require("./db.js");
//APP LEVEL MIDDLEWARES
app.use(helmet());
// app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/usersRouter"));
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/imageUpload", require("./routes/uploadRouter"));
app.use("/dishes", require("./routes/dishRouter"));
app.use("/promotions", require("./routes/promoRouter"));
app.use("/ledears", require("./routes/leaderRouter"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//PASSPORT CONFIG
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//INIT SERVER
app.listen(PORT,async() =>{
  try {
    mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      console.log(`Server started on http://localhost:${PORT}`);
      console.log(`🍃 DB connected!`);   
  } catch (error) {
    console.log("db err", error)
  }
});

module.exports = app;
