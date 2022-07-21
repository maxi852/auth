const express = require('express');

const passport = require('passport');
const cors = require('cors');
const passportSetup = require("./passport.js");
const authRoute = require("./routes/auth");
const mongoose = require('mongoose');
const session = require("express-session");

mongoose.Promise = global.Promise; //evita fallos en la conexión



const app = express();

app.use(
    session({
      secret: "secr3t",
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin:"http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true   
}))

app.use("/auth", authRoute);


mongoose.connect("mongodb://localhost:27017/User", {useNewUrlParser: true})
.then(() => {
    console.log('Conexión a la base de datos realizada con éxito');
    app.listen(5000, () => {
        console.log('Corriendo aplicación en el puerto ' + 5000);
    }
    )
})