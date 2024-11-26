const assert = require('node:assert');
const { describe, it } = require('node:test');
const { jwtService } = require('../../src/domain/services/jwt.service');

// Mock payload data for JWT tests
const payload = { userId: '1', sessionId: 'session123' };

describe('JwtService', () => {
  it('✔️ should generate a valid access token', () => {
    const token = jwtService.generateAccessToken(payload);
    assert.ok(token, 'Access token should be generated');

    const decoded = jwtService.verifyAccessToken(token);
    assert.ok(
      typeof decoded === 'object' && decoded !== null,
      'Decoded token should be an object'
    );

    assert.strictEqual(decoded.userId, payload.userId, 'Payload userId should match');
    assert.strictEqual(decoded.sessionId, payload.sessionId, 'Payload sessionId should match');
  });

  it('✔️ should generate a valid refresh token', () => {
    const token = jwtService.generateRefreshToken(payload);
    assert.ok(token, 'Refresh token should be generated');

    const decoded = jwtService.verifyRefreshToken(token);
    assert.ok(
      typeof decoded === 'object' && decoded !== null,
      'Decoded token should be an object'
    );

    assert.strictEqual(decoded.userId, payload.userId, 'Payload userId should match');
    assert.strictEqual(decoded.sessionId, payload.sessionId, 'Payload sessionId should match');
  });

  it('✔️ should generate a refresh token with specific expiry', () => {
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now
    const token = jwtService.generateRefreshToken(payload, expiresAt);
    assert.ok(token, 'Refresh token should be generated');

    const decoded = jwtService.verifyRefreshToken(token);
    assert.ok(
      typeof decoded === 'object' && decoded !== null,
      'Decoded token should be an object'
    );

    assert.strictEqual(decoded.userId, payload.userId, 'Payload userId should match');
    assert.strictEqual(decoded.sessionId, payload.sessionId, 'Payload sessionId should match');

    // Adjusting the expiration time check
    const expectedExp = Math.floor(expiresAt / 1000); // Convert expiresAt to seconds
    assert.ok(
      decoded.exp <= expectedExp,
      `Token should expire before or at the expected time. Expected: ${expectedExp}, Actual: ${decoded.exp}`
    );
  });


  it('✔️ should verify a valid access token', () => {
    const token = jwtService.generateAccessToken(payload);
    const verified = jwtService.verifyAccessToken(token);
    assert.ok(
      typeof verified === 'object' && verified !== null,
      'Verified token should be an object'
    );
    assert.strictEqual(verified.userId, payload.userId, 'Verified payload userId should match');
    assert.strictEqual(verified.sessionId, payload.sessionId, 'Verified payload sessionId should match');
  });

  it('❌ should return null for an invalid access token', () => {
    const token = 'invalidToken';
    const verified = jwtService.verifyAccessToken(token);
    assert.strictEqual(verified, null, 'Verification should return null for invalid token');
  });

  it('✔️ should verify a valid refresh token', () => {
    const token = jwtService.generateRefreshToken(payload);
    const verified = jwtService.verifyRefreshToken(token);
    assert.ok(
      typeof verified === 'object' && verified !== null,
      'Verified token should be an object'
    );
    assert.strictEqual(verified.userId, payload.userId, 'Verified payload userId should match');
    assert.strictEqual(verified.sessionId, payload.sessionId, 'Verified payload sessionId should match');
  });

  it('❌ should return null for an invalid refresh token', () => {
    const token = 'invalidToken';
    const verified = jwtService.verifyRefreshToken(token);
    assert.strictEqual(verified, null, 'Verification should return null for invalid token');
  });
});
