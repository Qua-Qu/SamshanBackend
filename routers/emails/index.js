const { getCartByUser } = require("../../services/carts");
const express = require("express");
const { authenticate } = require("../../middwares/auth");
const { sendMail } = require("../../mailer");
const nodeMailer = require("nodemailer");

const emailRouter = express.Router();

emailRouter.post("/", [authenticate], async (req, res) => {
  const { fullName, email, phone, address } = req.body;

  const user = req.user;

  const subject = "Samshan Shop";
  const status = false;

  const cartsUser = await getCartByUser(user.id);

  const total = cartsUser.reduce((total, item) => {
    return total + parseInt(item.priceProduct) * parseInt(item.count);
  }, 0);

  const htmlHead = `<table style="width:50%">
    <tr style="border: 1px solid black;"><th style="border: 1px solid black;">Nama Produk</th><th style="border: 1px solid black;">Gambar</th><th style="border: 1px solid black;">harga</th><th style="border: 1px solid black;">kuantitas</th><th style="border: 1px solid black;">total</th>`;

  let htmlContent = "";

  for (let i = 0; i < cartsUser.length; i++) {
    htmlContent += `<tr>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
        cartsUser[i].nameProduct
      }</td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;"><img src=${
        cartsUser[i].img
      }width="80" height="80"></td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
        cartsUser[i].priceProduct
      }$</td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
        cartsUser[i].count
      }</td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
      ${parseInt(cartsUser[i].priceProduct) * parseInt(cartsUser[i].count)}
      $</td><tr>`;
  }
  const htmlResult = `
  <h1>Hello ${fullName}</h1>
  <h3>Phone: ${phone}</h3>
  <h3>Address: ${address}</h3>
    ${htmlHead}
    ${htmlContent}
  <h1>Total Pembayaran: ${total}$
  <p>Terima kasih sudah berbelanja di Samshan Shop</p>
    `;

  const info = await sendMail(email, subject, htmlResult);

  res.status(200).send({ sendEmail: nodeMailer.getTestMessageUrl(info) });
});

module.exports = emailRouter;
