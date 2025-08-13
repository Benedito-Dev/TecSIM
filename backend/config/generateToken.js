const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // ajusta para ir uma pasta acima

const jwt = require('jsonwebtoken');
const authConfig = require('./auth'); 

console.log('authConfig:', authConfig);

const payload = { id: 99, email: 'silvaericmateus6@gmail.com' };

const token = jwt.sign(payload, authConfig.secret, { expiresIn: authConfig.expiresIn });

console.log('Token JWT:\n', token);
