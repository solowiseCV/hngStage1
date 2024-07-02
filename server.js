import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();

// Middleware to extract the client's IP address
app.use((req, res, next) => {
    try {
        let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // Handle IPv6-mapped IPv4 addresses
        if (clientIp.startsWith('::ffff:')) {
            clientIp = clientIp.split(':').pop();
        }
        req.clientIp = clientIp;
        next();
    } catch (error) {
        next(error);
    }
});

app.get('/api/hello', async (req, res, next) => {
    try {
        const visitorName = req.query.visitor_name;
        if (!visitorName) {
            const error = new Error('Visitor name is required');
            error.status = 400;
            throw error;
        }
        const clientIp = req.clientIp || '127.0.0.1'; // default to 127.0.0.1 if not found
console.log(clientIp)
        let city;
        try {
            // First try to get location information from ipapi using the extracted client IP
            const ipapiResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
            if (ipapiResponse.data.error) {
                throw new Error(ipapiResponse.data.reason);
            }
            city = ipapiResponse.data.city;
        } catch (error) {
            console.error(`ipapi failed: ${error.message}. Trying ip-api.com...`);
            // If ipapi fails, fallback to ip-api.com
            const ipApiResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
            if (ipApiResponse.data.status !== 'success') {
                throw new Error(ipApiResponse.data.message);
            }
            city = ipApiResponse.data.city;
        }

        console.log(`Client IP: ${clientIp}`);
        console.log(`Determined city: ${city}`);

        // Get weather information from OpenWeatherMap
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: process.env.OPENWEATHERMAP_API_KEY,
                units: 'metric',
            },
        });

        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}.`,
        });

    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500,
        },
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running with a speed of light on port ${port}`);
});
