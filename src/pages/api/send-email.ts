import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Grand Reception Hall" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html: body,
    });

    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Emails Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
