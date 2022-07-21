const passport = require('passport');
const User = require('./models/User')

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

const GOOGLE_CLIENT_ID = "530239725-m459ifekj6r9pqhjn9n7nroehghvena4.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const emails = ['maxi.rocca99@gmail.com']

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
    
  },  function (token, refreshToken, profile, done) {
    const response = emails.includes(profile.emails[0].value);
    // IF EXITS IN DATABASE
    if (response) {
      done(null, profile);
      //console.log(profile);
    } else {
      // SAVE IN DATABASE
      emails.push(profile.emails[0].value);
      done(null, profile);
      
    }
    process.nextTick(function() {  
        //lo busca en la base de datos con el mail
        User.findOne({ 'email' : profile.emails[0].value }, function(err, user) { 
            // si hay error frena
            if (err)
                return done(err);
 
            //si se encuentra al usuario
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user); //retorna el usuario encontrado
            } else {
                // si no hay usuario con el mail lo crea
                var newUser  = new User();
 
                newUser.uid    = profile.id;                 
                newUser.token = token;   
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; 
                newUser.email = profile.emails[0].value; 
                newUser.gender = profile.gender;
                newUser.pic = profile.photos[0].value;
                // se guarda en la base de dato
                newUser.save(function(err) {
                    if (err)
                        throw err;
 
                    return done(null, newUser);
                });
            }
 
        });
    
 
    })
  }

));
            





  passport.use(new FacebookStrategy({
 
    // luego cambiar por otros
    clientID        : "764437818316384",
    clientSecret    : "08f2e88bdaebb82ed653b4099e104ff3",
    callbackURL     : "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
 
},
function(token, refreshToken, profile, done) {
 
    process.nextTick(function() {
 
        User.findOne({ 'uid' : profile.id }, function(err, user) {
 
            if (err)
                return done(err);
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user); 
            } else {
                var newUser  = new User();
 
                newUser.uid    = profile.id;                   
                newUser.token = token; 
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; 
                newUser.email = profile.emails[0].value; 
                newUser.gender = profile.gender;
                newUser.pic = profile.photos[0].value;

                newUser.save(function(err) {
                    if (err)
                        throw err;
 
                    return done(null, newUser);
                });
            }
 
        });
 
    })
 
}));


//lo que guarda en la sesion
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
 

passport.deserializeUser(function(id, done) {
    User.findOne({id}, function(err, user) {
        done(err, user);
    });
});