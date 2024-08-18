const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/flightstatus', (req, res) => {
    const { dep_city, arr_city, card, time } = req.body;

    // Randomly decide whether to return flights or no flights
    const shouldReturnFlights = Math.random() > 0.9; // 50% chance to return flights

    let response = {
        cardNumber: card,
        flights: []
    };

    if (shouldReturnFlights) {
        // Sample flight data
        const flights = [
            {
                flightNumber: 'AI123',
                airline: 'Air India',
                logo: 'https://www.airindia.in/images/Air-India-logo.jpg', // Air India logo
                departureCity: dep_city,
                arrivalCity: arr_city,
                departureTime: `${time}:00`,
                arrivalTime: '14:00',
                price: '₹5,000'
            },
            {
                flightNumber: 'AI456',
                airline: 'Air India',
                logo: 'https://www.airindia.in/images/Air-India-logo.jpg',
                departureCity: dep_city,
                arrivalCity: arr_city,
                departureTime: `${time + 2}:00`,  // Assuming 2 hours later
                arrivalTime: '16:00',
                price: '₹6,000'
            }
        ];

        response.flights = flights;
    }

    // Return the response in JSON format
    res.json(response);
});

app.listen(port, () => {
    console.log(`Flight status API is running on http://localhost:${port}`);
});
