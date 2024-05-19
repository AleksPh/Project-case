const subscribe = async (email) => {
  try {
    const response = await fetch('/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      console.log('Subscribed successfully');
    } else {
      console.error('Error subscribing:', response.statusText);
    }
  } catch (error) {
    console.error('Error subscribing:', error.message);
  }
};

// Викликаємо функцію subscribe з електронною адресою користувача
const userEmail = 'example@example.com'; // Встановлюємо електронну адресу користувача
subscribe(userEmail);
