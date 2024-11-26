const assert = require('assert');
const { describe, it } = require('node:test');
const bcrypt = require('bcrypt');
const { randomUUID } = require('node:crypto');

const { AuthService } = require('../../src/domain/services/auth.service');

// Mock dependencies for AuthService
const mockUserRepository = {
  getByUsername: async (username) => {
    if (username === 'testUser') {
      return {
        id: randomUUID(),
        username,
        passwordHash: await bcrypt.hash('correctPassword', 10),
      };
    }
    return null;
  },
  save: async (user) => user,
};
const mockJwtService = {
  generateAccessToken: () => 'mockAccessToken',
  generateRefreshToken: () => 'mockRefreshToken',
  verifyAccessToken: (token) => {
    if (token === 'mockAccessToken') {
      return { userId: 'testUserId', sessionId: 'testSessionId', isPrivileged: false };
    }
    throw new Error('Invalid access token');
  },
  verifyRefreshToken: (token) => {
    if (token === 'mockRefreshToken') {
      return { userId: 'testUserId', sessionId: 'testSessionId' };
    }
    throw new Error('Invalid refresh token');
  },
};

const authService = new AuthService({
  // @ts-ignore - mock dependencies
  userRepository: mockUserRepository,
  // @ts-ignore - mock dependencies
  jwtService: mockJwtService,
});

// Tests
describe('AuthService', () => {
  it('🔒 generatePasswordHash: should generate a password hash', async () => {
    const password = 'myPassword';
    const hash = await authService.generatePasswordHash(password);

    assert.notEqual(hash, password, 'The password hash should not be equal to the password');
    assert.ok(await bcrypt.compare(password, hash), 'The hash should match the password');
  });

  it('❌ authenticateUser: should throw an error if the user is not found', async () => {
    try {
      await authService.authenticateUser('nonExistingUser', 'password');
      assert.fail('Expected an error');
    } catch (error) {
      assert.strictEqual(error.message, 'User not found', 'The error message should be "User not found"');
    }
  });

  it('❌ authenticateUser: should throw an error for an incorrect password', async () => {
    try {
      await authService.authenticateUser('testUser', 'wrongPassword');
      assert.fail('Expected an error');
    } catch (error) {
      assert.strictEqual(error.message, 'Invalid credentials', 'The error message should be "Invalid credentials"');
    }
  });

  it('✅ authenticateUser: should return the user for correct credentials', async () => {
    const user = await authService.authenticateUser('testUser', 'correctPassword');

    assert.strictEqual(user.username, 'testUser', 'The username should match');
    assert.strictEqual(user.passwordHash, null, 'The password hash should be removed');
  });

  it('🔑 login: should return access and refresh tokens', async () => {
    const { accessToken, refreshToken, user } = await authService.login('testUser', 'correctPassword');

    assert.ok(accessToken, 'The access token should be defined');
    assert.ok(refreshToken, 'The refresh token should be defined');
    assert.strictEqual(user.username, 'testUser', 'The username should match');
  });

  it('📜 checkAccess: should return payload for a valid token', async () => {
    const payload = await authService.checkAccess('mockAccessToken');

    assert.ok(payload.userId, 'The payload should contain userId');
    assert.ok(payload.sessionId, 'The payload should contain sessionId');
    assert.strictEqual(payload.isPrivileged, false, 'isPrivileged should be false');
  });
});
