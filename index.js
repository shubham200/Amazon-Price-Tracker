const cheerio= require('cheerio')
const request =require('request')
const express= require('express')
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


const app= express()

const port=process.env.PORT || 4000

var flag=0

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/track',async(req,res)=>{
    const url=await req.body.url
    const price=await req.body.price
    const email=req.body.email
    res.render('final')
    down=setInterval(() => {
       
  request(url,{json:true},async(res,err,html)=>{
        const $=cheerio.load(html)
        const prize=[]
        var Title
        
        $('td.a-span12>span').map((i,element)=>{
            // console.log($(element).text())
            prize[i]=$(element).text()
        })

        $('span#productTitle').each((i,element)=>{
            // console.log($(element).text())
            Title=$(element).text()
        })

        let cost=prize[2]
        let str=cost.toString()
        let newstr=str.replace(/₹/g,'')
        str=newstr.replace(/\s/g,'')
        title=Title.replace(/\s/g,'')

        // cost=parseInt(newstr)

        console.log(str)
        console.log(price)
        console.log(title)
        
        if(price>=str){
            mail(email,title,str,price)
             clearInterval(down)
        }
            
    })
   
}, 10000);   

})



function mail(email,title,price,yourprice){
    console.log('hello there!!!')
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'sinshubh13@gmail.com',
          pass: 'nothingnew'
        }
      }));
      
      var mailOptions = {
        from: 'sinshubh13@gmail.com',
        to: email,
        subject: 'Amazon-Price-Tracker',
        text: `congrats your ${title} is available at price ${price}.Your price was ${yourprice}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });  
}
app.listen(port,()=>{
    console.log('listening on port'+port)
})


