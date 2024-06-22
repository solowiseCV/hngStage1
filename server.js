import express, { Router } from 'express'
import dotenv from "dotenv"

const app = express();
dotenv.config();

// Middleware to extract the client's IP address
app.use((req, res, next) => {
    try {
        let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
  
 
  app.get('/api/hello', (req, res, next) => {
    try {
      const visitorName = req.query.visitor_name;
      if (!visitorName) {
        const error = new Error('Visitor name is required');
        error.status = 400;
        throw error;
      }
      const clientIp = req.clientIp || '127.0.0.1'; // default to 127.0.0.1 if not found
  
      res.json({
        Client_ip: clientIp,
        greetings: `hello, ${visitorName}`
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
        status: err.status || 500
      }
    });
  });
  

;
const port = process.env.PORT || 3000;
app.listen(5000, ()=>{
    console.log("Server is running with a speed of light on port",port);
});