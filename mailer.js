const nodeMailer = require("nodemailer");
const { google } = require("googleapis");

const clientId =
  "766085666166-v9nbr9iopveklcm1i92muh7h8ihtvbgv.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//04tN9yTkv-VrjCgYIARAAGAQSNwF-L9Irpq7inNWJi8oDtQ8GKuiOrODlZsxUR4HZ6hFtX7McyM1RECyneCK607I5OepWGhDBCfE";
const adminEmail = "ardhiwahyuw12@students.amikom.ac.id";

const sendMail = async (to, subject, htmlContent) => {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: adminEmail,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  });

  const info = await transporter.sendMail({
    from: adminEmail,
    to,
    subject,
    html: htmlContent,
  });

  return info;
};

module.exports = {
  sendMail,
};
