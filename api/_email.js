import { esc } from './_lib.js';
// Order-confirmation email sent with the download link. Table-based layout with inline styles so it renders in Gmail, Outlook and phone mail apps.
export function orderEmail({ productName, name, downloadUrl, reference, imageUrl, siteUrl }) {
  const hello = name ? `Hello ${esc(name)},` : 'Hello,';
  const img = imageUrl ? `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:10px 0 25px;"><img src="${esc(imageUrl)}" alt="${esc(productName)} cover" width="190" style="display:block; width:190px; max-width:100%; height:auto; border-radius:7px; box-shadow:0 8px 22px rgba(0,0,0,0.13);" /></td></tr></table>` : '';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Purchase Successful | LearnTern</title></head>
<body style="margin:0; padding:0; background-color:#f4f6f4; font-family:Arial, Helvetica, sans-serif; color:#1c3026;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f4; padding:35px 12px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden;">
<tr><td align="center" style="background:#EDF6F1; padding:32px 20px;">
<div style="font-size:35px; color:#025834; margin-bottom:12px;">&#10003;</div>
<h1 style="font-size:25px; color:#013921; margin:0 0 9px;">Purchase Successful!</h1>
<p style="font-size:14px; color:#62766a; margin:0; line-height:23px;">Your payment has been confirmed. Your next learning experience starts here.</p>
<div style="width:45px; height:3px; background:#FFCE2C; margin:19px auto 0;"></div></td></tr>
<tr><td style="padding:32px 35px 15px;">
<p style="font-size:15px; line-height:25px; margin:0 0 15px;">${hello}</p>
<p style="font-size:15px; line-height:26px; color:#53645a; margin:0 0 22px;">Thank you for your purchase of <strong style="color:#013921;">${esc(productName)}</strong>. We're delighted to have you learning with LearnTern!</p>
${img}
<h2 style="font-size:19px; color:#013921; text-align:center; margin:0 0 9px;">Your book is ready!</h2>
<p style="font-size:14px; color:#77847b; text-align:center; line-height:23px; margin:0 0 23px;">Click the button below to download your copy and start reading.</p>
<table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" bgcolor="#025834" style="border-radius:7px;">
<a href="${esc(downloadUrl)}" style="display:inline-block; padding:16px 38px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold; border-radius:7px;">Download Your Book &nbsp; &darr;</a></td></tr></table>
<p style="font-size:12px; color:#c14b43; text-align:center; margin:16px 0 28px;">Please note: This download link is valid for 72 hours only.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F7F3; border-radius:8px; border-left:3px solid #025834;"><tr><td style="padding:19px 20px;">
<p style="font-size:11px; color:#77847b; margin:0 0 9px; letter-spacing:1px;">PAYMENT REFERENCE</p>
<p style="font-size:13px; color:#013921; font-weight:bold; margin:0; word-break:break-all; line-height:21px;">${esc(reference || '')}</p></td></tr></table>
<p style="font-size:14px; line-height:24px; color:#647168; margin:27px 0 25px;">Need help? Simply reply to this email or contact our support team at <a href="mailto:hello@learntern.co" style="color:#025834;">hello@learntern.co</a>. We're always happy to help.</p>
<p style="font-size:14px; line-height:23px; color:#53645a; margin:0 0 30px;">Happy reading!<br><strong style="color:#025834;">The LearnTern Team</strong></p>
</td></tr>
<tr><td align="center" style="background:#013921; padding:28px 20px;">
<p style="font-size:21px; font-weight:bold; color:#ffffff; margin:0 0 9px;">LearnTern<span style="color:#FFCE2C;">.</span></p>
<p style="font-size:12px; color:#c5d5ca; margin:0 0 17px; line-height:20px;">Empowering your learning journey, one book at a time.</p>
<div style="width:35px; height:2px; background:#FFCE2C; margin:0 auto 17px;"></div>
<p style="font-size:12px; margin:0 0 13px;"><a href="${esc(siteUrl)}" style="color:#ffffff; text-decoration:none;">www.learntern.co</a></p>
<p style="font-size:11px; color:#9db2a4; margin:0;">&copy; ${new Date().getFullYear()} LearnTern. All rights reserved.</p>
</td></tr></table></td></tr></table></body></html>`;
}
