export function bookingEmailTemplate(data: {
  customerName: string;
  date: string;
  timeSlot: string;
  totalAmount: string;
  advanceAmount: string;
  balance: string;
  invoiceNumber: string;
}) {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Booking Confirmation</title>

    <style>
      body { margin: 0; background: #f6f7f9; font-family: Arial, sans-serif; }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      }

      .header {
        background: linear-gradient(135deg, #4f46e5, #6366f1);
        color: white;
        padding: 30px;
        text-align: center;
      }

      .header h1 { margin: 0; font-size: 26px; }

      .content { padding: 30px; color: #333; font-size: 15px; line-height: 1.6; }

      .box {
        background: #f3f4f6;
        padding: 18px;
        border-radius: 10px;
        margin: 20px 0;
      }

      .footer {
        text-align: center;
        padding: 20px;
        font-size: 13px;
        color: #777;
      }

      .btn {
        display: inline-block;
        background: #4f46e5;
        color: white;
        text-decoration: none;
        padding: 14px 22px;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 15px;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="header">
        <h1>Grand Reception Hall</h1>
        <p style="margin-top: 6px; opacity: 0.9;">Booking Confirmation</p>
      </div>

      <div class="content">
        <p>Dear <strong>${data.customerName}</strong>,</p>

        <p>Your booking has been successfully confirmed. Below are the details:</p>

        <div class="box">
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time Slot:</strong> ${data.timeSlot}</p>
          <p><strong>Total Amount:</strong> ${data.totalAmount}</p>
          <p><strong>Advance Paid:</strong> ${data.advanceAmount}</p>
          <p><strong>Balance:</strong> ${data.balance}</p>
          <p><strong>Invoice No:</strong> ${data.invoiceNumber}</p>
        </div>

        <center>
          <a href="#" class="btn">View Booking Details</a>
        </center>

        <p style="margin-top: 20px;">
          Thank you for choosing <strong>Grand Reception Hall</strong>.  
          We look forward to serving you!
        </p>
      </div>

      <div class="footer">
        © 2025 Grand Reception Hall — All rights reserved.
      </div>

    </div>
  </body>
  </html>
  `;
}
