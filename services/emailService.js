import transporter from '../config/emailConfig.js';

export const sendConfirmationEmail = (email, link) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title></title>
    <style>
      table, td, div, h1, p {
        font-family: Arial, sans-serif;
      }
      @media screen and (max-width: 530px) {
        .unsub {
          display: block;
          padding: 8px;
          margin-top: 14px;
          border-radius: 6px;
          background-color: #000000;
          text-decoration: none !important;
          font-weight: bold;
        }
        .col-lge {
          max-width: 100% !important;
        }
      }
      @media screen and (min-width: 531px) {
        .col-sml {
          max-width: 27% !important;
        }
        .col-lge {
          max-width: 73% !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;word-spacing:normal;background-color:#fcfcfc;">
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;">
      <table role="presentation" style="width:100%;border:none;border-spacing:0;">
        <tr>
          <td align="center">
            <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
              <tr>
                <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                  <img src="https://i.imgur.com/UDTVbPD.png" width="165" alt="Logo" style="width:300px;max-width:80%;height:auto;">
                </td>
              </tr>
              <tr>
                <td style="padding:10px 30px 30px 30px;background-color:#ffffff;">
                  <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;">Welcome to TaskUnity!</h1>
                  <p style="margin:0;">Please click the button below to confirm your account:</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 30px 30px 30px;background-color:#ffffff;">
                  <p style="margin:0;"><a href="${link}" style="background: #423F98; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block;"><span style="font-weight:bold;">Confirm Account</span></a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;text-align:center;font-size:12px;background-color:#222145;color:#FFFFFF;">
                  <p style="margin:0;font-size:14px;">&reg; TaskUnity, 2025</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: 'TaskUnity <info@taskunity.com>',
    to: email,
    subject: 'TaskUnity - Account Confirmation',
    html: htmlContent,
  };

  transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = (email, link) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title></title>
    <style>
      table, td, div, h1, p {
        font-family: Arial, sans-serif;
      }
      @media screen and (max-width: 530px) {
        .unsub {
          display: block;
          padding: 8px;
          margin-top: 14px;
          border-radius: 6px;
          background-color: #000000;
          text-decoration: none !important;
          font-weight: bold;
        }
        .col-lge {
          max-width: 100% !important;
        }
      }
      @media screen and (min-width: 531px) {
        .col-sml {
          max-width: 27% !important;
        }
        .col-lge {
          max-width: 73% !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;word-spacing:normal;background-color:#fcfcfc;">
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;">
      <table role="presentation" style="width:100%;border:none;border-spacing:0;">
        <tr>
          <td align="center">
            <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
              <tr>
                <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                  <img src="https://i.imgur.com/UDTVbPD.png" width="165" alt="Logo" style="width:300px;max-width:80%;height:auto;">
                </td>
              </tr>
              <tr>
                <td style="padding:10px 30px 30px 30px;background-color:#ffffff;">
                  <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;">You have requested to reset your password</h1>
                  <p style="margin:0;">Please click the button below to reset your password:</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 30px 30px 30px;background-color:#ffffff;">
                  <p style="margin:0;"><a href="${link}" style="background: #423F98; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block;"><span style="font-weight:bold;">Reset Password</span></a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;text-align:center;font-size:12px;background-color:#222145;color:#FFFFFF;">
                  <p style="margin:0;font-size:14px;">&reg; TaskUnity, 2023</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: 'TaskUnity <info@taskunity.com>',
    to: email,
    subject: 'TaskUnity - Reset Your Password',
    html: htmlContent,
  };

  transporter.sendMail(mailOptions);
};
