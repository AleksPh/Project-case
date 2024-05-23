const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./db');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Роут для підписки на оновлення курсу валют
app.post('/subscribe-update', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const user = new User({ email });
    await user.save();
    res.status(201).send('Subscribed successfully for updates');
  } catch (error) {
    res.status(400).send('Error subscribing for updates');
  }
});

// Функція для відправлення листів з оновленням курсу валют
const sendEmails = async () => {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
    );
    const uahRate = response.data.rates.UAH;

    const users = await User.find({});
    users.forEach((user) => {
      transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Daily USD to UAH Rate',
        text: `Current USD to UAH rate is: ${uahRate}`,
      });
    });
    console.log('Daily emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

// Запускаємо функцію відправлення листів щодня о 9:00 за київським часом
cron.schedule('0 9 * * *', sendEmails);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

