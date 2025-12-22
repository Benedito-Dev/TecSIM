const request = require('supertest');
const express = require('express');
const refreshTokenController = require('../../controllers/auth/refreshTokenController');

const app = express();
app.use(express.json());
app.post('/refresh', refreshTokenController.refresh);
app.post('/revoke', refreshTokenController.revoke);

describe('RefreshTokenController', () => {
  test('should return 400 when refreshToken is missing', async () => {
    const response = await request(app)
      .post('/refresh')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Refresh token é obrigatório');
  });

  test('should return 400 when refreshToken is missing for revoke', async () => {
    const response = await request(app)
      .post('/revoke')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Refresh token é obrigatório');
  });
});

module.exports = { app };