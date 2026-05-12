// src/server.js
/**
 * Express server for OAuth2Server
 */

const express = require('express');
const { OAuth2ServerService } = require('./services/oauth2server-service');
const morgan = require('morgan');
const cors = require('cors');

class Server {
    constructor(port = 3000) {
        this.port = port;
        this.app = express();
        this.service = new OAuth2ServerService();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan('dev'));
    }

    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy', service: 'OAuth2Server' });
        });

        this.app.get('/api/data', async (req, res) => {
            try {
                const data = await this.service.getData();
                res.json({ success: true, data });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/process', async (req, res) => {
            try {
                const result = await this.service.process(req.body);
                res.json({ success: true, result });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.use((req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 OAuth2Server server running on port ${this.port}`);
        });
    }
}

const server = new Server(process.env.PORT || 3000);
server.start();

module.exports = { Server };
