const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");


const app= express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res){
  res.render("home")
})

var email;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'Gmail',
  auth: {
    user: 'emailAddress',
    pass: 'emailPassword'
  }
});

var otp = Math.random();
otp = otp * 1000000;
otp = Math.floor(otp);
console.log(otp);


app.post('/send', function(req, res){
   email = req.body.email;

   var mailOptions={
     to: req.body.email,
     subject: 'Otp for registration',
     html: "<h3>OTP for account verification is </h3>" + otp
   };

   transporter.sendMail(mailOptions, function(error, info){
     if(error){
       return console.log(error)
     }
     console.log('Message sent: %s', info.messageId);
     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

     res.render('otp')
   })
});

app.post('/verify', function(req, res){
  const submit = parseInt(req.body.otp)
  console.log(submit)

  if(submit === otp){
    res.send("you have Successfully logged in")
  } else {
    res.render('otp',{msg : 'otp is incorrect'})
  }

})

app.post('/resend', function(req, res){
  var mailOptions={
    to: email,
    subject: "Otp for registration",
    html: "<h3>OTP for account verification is" + otp + "</h3>"
  };

  transporter.sendMail(mailOptions, function(err, info){
    if(error){
      console.log(error)
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.rendr('otp', {meg: 'otp has been resend'})
  })
})

app.listen(3000, function(){
  console.log('app started')
})
