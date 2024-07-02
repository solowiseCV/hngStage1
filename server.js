import express from 'express';

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

app.get('/api/get-ip', (req, res) => {
    const clientIp = req.clientIp || '127.0.0.1'; // default to 127.0.0.1 if not found
    res.json({
        client_ip: clientIp,
    });
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
