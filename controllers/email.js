const nodemailer = require("nodemailer");
const sendEmail=async(req,res)=>{
    const config = {
        Service:"gmail",
        host:"smtp.gmail.com",
        secure:false,
        auth:{
            user:"21girirajdigital@gmail.com",
            pass:"yqicxcwynhuuiqzt"
        }
    }
    const mailOptions = {
        from: '21girirajdigital@gmail.com',
        to: '21girirajdigital@gmail.com', // Replace with the current user's email address
        subject: 'Invoice for your order',
        text: 'Attached is the invoice for your order.',
        // attachments: [
        //   {
        //     filename: 'invoice.pdf',
        //     path: 'invoice.pdf', // Path to the generated PDF
        //   },
        // ],
      };
    const transporter = nodemailer.createTransport(config);
    try{
        const info =await transporter.sendMail(mailOptions);
        console.log("inforesponse",info)
         if(info.accepted.length>0){
            res.status(200).json({data:"Invice generated!"})
         }
    }catch{
        res.status(200).json({data:"something went wrong!"})
    }

}
module.exports={
    sendEmail
}