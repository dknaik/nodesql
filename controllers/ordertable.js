// const { sequelize } = require("../models")
const { Sequelize } =  require("sequelize")
const fs = require('fs');
const PDFTable = require('pdfkit-table');
const nodemailer = require("nodemailer");
const path = require('path');

let db=require('../models/index')
const PDFDocument = require('pdfkit')
let orderTable = db.orderTable;
let cartTable=db.cartTable;
let Product = db.products;
let orderItem = db.orderItems
let Invoice = db.invoice
let User = db.user

const generateInvoicePDF=(getOrderDetails,res)=>{
    console.log("getOrderDetails",getOrderDetails)
  const doc=new PDFDocument();
//   doc.font('defaultFont');
// doc.registerFont('defaultFont','/home/giriraj-dinesh/Documents/D-Drive/Dinesh/nodesequiliz/nodeseq/fonts/VIPRoman-Regular.ttf')
// doc.font('defaultFont');
//   doc.font();
// doc.reegisterFont('customFont','./fonts/Helvtica.ttf');

  //creating write stream to save the PDF file
//   doc.font('customFont');
  const writeStream = fs.createWriteStream('invoice.pdf');

  //Pipe the document to the write stream
  doc.pipe(writeStream);


  //Add content to the PDF
  doc.fontSize(18).text('Invoice Details',{align:'center'})
  
  doc.fontSize(14).text(`Order ID: ${getOrderDetails.id}`);
  doc.fontSize(14).text(`Customer Name: ${getOrderDetails[0].User.firstName}`)
  doc.fontSize(14).text(`Customer Email:${getOrderDetails[0].User.email}`)

  doc.fontSize(14).text(`Invoice Number:${getOrderDetails[0].invoices[0].invoiceNumber}`)
  doc.fontSize(14).text(`Total Amount:${getOrderDetails[0].totalAmount}`)
  const table = new PDFTable(doc,{
    bottomMargin:30,
  });
  table.addPlugin(new (require('pdfkit-table/plugins/fitcolumn'))({
    column: 4,
  }));
  table
    .addHeader([
      { text: 'Product Name', align: 'center' },
      { text: 'Quantity', align: 'center' },
      { text: 'Price', align: 'center' },
      { text: 'Total', align: 'center' },
    ]);

    let totalAmount = 0;
    getOrderDetails[0].orderitems.forEach((item) => {
      const totalItemPrice = item.quantity * item.Product.price;
      totalAmount += totalItemPrice;
      table.addRow([
        { text: item.Product.name, align: 'left' },
        { text: item.quantity.toString(), align: 'center' },
        { text: `Rs ${item.Product.price}`, align: 'center' },
        { text: `Rs ${totalItemPrice}`, align: 'center' },
      ]);
    });
    doc.moveDown();
    table.draw({ x: 50, y: doc.y });
    doc.moveDown().fontSize(14).text(`Total Amount: Rs ${totalAmount}`, { align: 'right' });
    doc.end();
  writeStream.on('error', (err) => {
    res.status(500).json({ message: 'Error generating the invoice PDF.' });
  });
  writeStream.on('finish', () => {
    // Send a success response to the client
    // res.status(200).json({ message: 'Invoice PDF created successfully.' });
    res.download('/invoice.pdf', 'invoice.pdf', (err) => {
        if (err) {
          // If an error occurs during download, send an error response
          res.status(500).json({ message: 'Error downloading the invoice PDF.' });
        } else {
          // The download was successful, no need to send any other response
          // The browser should prompt the user to download the PDF file
        }
      });
  });
}

// const getPdfFile=async(req,res)=>{

   

      function createInvoice(getOrderDetails, path) {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
      
        generateHeader(doc);
        generateCustomerInformation(doc, getOrderDetails);
        generateInvoiceTable(doc, getOrderDetails);
        generateFooter(doc);
      
        doc.end();
        doc.pipe(fs.createWriteStream(path));
      }

      function generateHeader(doc) {
        doc
        //   .image("logo.png", 50, 45, { width: 50 })
          .fillColor("#444444")
          .fontSize(20)
          .text("ACME Inc.", 110, 57)
          .fontSize(10)
          .text("ACME Inc.", 200, 50, { align: "right" })
          .text("123 Main Street", 200, 65, { align: "right" })
          .text("New York, NY, 10025", 200, 80, { align: "right" })
          .moveDown();
      }
      function generateCustomerInformation(doc, getOrderDetails) {
        doc
          .fillColor("#444444")
          .fontSize(20)
          .text("Invoice", 50, 160);
      
        generateHr(doc, 185);
      
        const customerInformationTop = 200;
      
        doc
          .fontSize(10)
          .text("Invoice Number:", 50, customerInformationTop)
          .font("Helvetica-Bold")
          .text(getOrderDetails[0].invoices[0].invoiceNumber, 150, customerInformationTop)
          .font("Helvetica")
          .text("Invoice Date:", 50, customerInformationTop + 15)
          .text(formatDate(new Date()), 150, customerInformationTop + 15)
          .text("Balance Due:", 50, customerInformationTop + 30)
          .text(
            formatCurrency(getOrderDetails[0].totalAmount - 0),
            150,
            customerInformationTop + 30
          )
      
          .font("Helvetica-Bold")
          .text("John Doe", 300, customerInformationTop)
          .font("Helvetica")
          .text("1234 Main Street", 300, customerInformationTop + 15)
          .text(
            "San Francisco" +
              ", " +
              "CA" +
              ", " +
              "US",
            300,
            customerInformationTop + 30
          )
          .moveDown();
      
        generateHr(doc, 252);
      }

      function generateInvoiceTable(doc, getOrderDetails) {
        let totalAmount = 0;
        getOrderDetails[0].orderitems.forEach((item) => {
            const totalItemPrice = item.quantity * item.Product.price;
            totalAmount += totalItemPrice;
            
          });
        let i;
        const invoiceTableTop = 330;
      
        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          invoiceTableTop,
          "Item",
          "Description",
          "Unit Cost",
          "Quantity",
          "Line Total"
        );
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");
      
        for (i = 0; i < getOrderDetails[0].orderitems.length; i++) {
          const item = getOrderDetails[0].orderitems[i];
          const position = invoiceTableTop + (i + 1) * 30;
          generateTableRow(
            doc,
            position,
            item.Product.name,
            "xyz",
            formatCurrency(item.Product.price),
            item.quantity,
            formatCurrency(item.quantity * item.Product.price)
          );
      
          generateHr(doc, position + 20);
        }
      
        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          subtotalPosition,
          "",
          "",
          "Subtotal",
          "",
          formatCurrency(totalAmount)
        );
      
        const paidToDatePosition = subtotalPosition + 20;
        generateTableRow(
          doc,
          paidToDatePosition,
          "",
          "",
          "Paid To Date",
          "",
          formatCurrency(0)
        );
      
        const duePosition = paidToDatePosition + 25;
        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          duePosition,
          "",
          "",
          "Balance Due",
          "",
          formatCurrency(totalAmount - 0)
        );
        doc.font("Helvetica");
      }
      
      function generateFooter(doc) {
        doc
          .fontSize(10)
          .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
          );
      }
      function generateTableRow(
        doc,
        y,
        item,
        description,
        unitCost,
        quantity,
        lineTotal
      ) {
        doc
          .fontSize(10)
          .text(item, 50, y)
          .text(description, 150, y)
          .text(unitCost, 280, y, { width: 90, align: "right" })
          .text(quantity, 370, y, { width: 90, align: "right" })
          .text(lineTotal, 0, y, { align: "right" });
      }
      function generateHr(doc, y) {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      }
      
      function formatCurrency(cents) {
        return "$" + (cents / 100).toFixed(2);
      }
      
      function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
      
        return year + "/" + month + "/" + day;
      }

// }
const placeOrder=async(req,res)=>{
    // const {user_id,order_date,total_amount,...rest}=req.body
    //get cart Items
    const cartItems = await cartTable.findAll({
        where:{
           user_id:1
        },
        include:[
            {
                model:Product
            }
        ]
    })
    let totalAmount=0;
    const {user_id}= cartItems[0]
    for(const cartItem of cartItems){
        totalAmount += cartItem.Product.price * parseInt(cartItem.quantity)
    }
    const createOrderTable=await orderTable.create({
        user_id:user_id,
        order_date:new Date().toISOString(),
        total_amount:totalAmount
    })
    const createOrderItem = cartItems.map((cartItem)=>({
        order_id:createOrderTable.id,
        product_id:cartItem.ProductId,
        quantity:cartItem.quantity,
        price_per_unit:cartItem.Product.price
    }))
    await orderItem.bulkCreate(createOrderItem);
    

    // Generate he invoice
    const invoice = await Invoice.create({
        invoiceNumber:`INV-${createOrderTable.id}`,
        invoiceDate : new Date().toISOString(),
        user_id:user_id,
        totalAmount:totalAmount,
        order_id:createOrderTable.id
    })
    await orderItem.update({invoice_id:invoice.id},{where:{order_id:createOrderItem.id}})
    const getOrderDetails=await orderTable.findAll({
        include:[
            {
           model:User
            },
            {
              model:Invoice
            },
            {
            model:orderItem,
            include: [
                {
                  model: Product,
                },
              ],
        }],
        where:{
            id:createOrderTable.id
        }

    })
    if(getOrderDetails && getOrderDetails.length > 0) {
        const pdfFilePath = path.resolve(__dirname, 'invoice.pdf');
        createInvoice(getOrderDetails, pdfFilePath);
       //email code starts
        console.log("pdffilepath",pdfFilePath)
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
            attachments: [
              {
                filename: 'invoice.pdf',
                path: pdfFilePath, // Path to the generated PDF
              },
            ],
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
      //email code ends
        // const invoice = {
        //     shipping: {
        //       name: "John Doe",
        //       address: "1234 Main Street",
        //       city: "San Francisco",
        //       state: "CA",
        //       country: "US",
        //       postal_code: 94111
        //     },
        //     items: [
        //       {
        //         item: "TC 100",
        //         description: "Toner Cartridge",
        //         quantity: 2,
        //         amount: 6000
        //       },
        //       {
        //         item: "USB_EXT",
        //         description: "USB Cable Extender",
        //         quantity: 1,
        //         amount: 2000
        //       }
        //     ],
        //     subtotal: 8000,
        //     paid: 0,
        //     invoice_nr: 1234
        //   };
        
   }
   
    // res.status(200).json({data:getOrderDetails})


}

const getOrderTableDetails=async(req,res)=>{
     const orderTableData = await orderTable.findAll({
        include:[{
            model:orderItem,
            include: [Product],
        }],
     })
     res.status(200).json({data:orderTableData})
}
module.exports={
    placeOrder,
    getOrderTableDetails
}