const assert = require('node:assert');
const { describe, it } = require('node:test');
const {
  CheckoutService,
} = require('../../src/domain/services/checkout.service');
const { pricingService } = require('../../src/domain/services/pricing.service');

// Mock dependencies for CheckoutService
const mockUserRepository = {
  getById: async (id) => (id === '1' ? { id, username: 'testuser' } : null),
};
const mockCartRepository = {
  getByUserId: async (userId) =>
    userId === '1'
      ? { items: [{ product: { id: '101', price: 50 }, quantity: 2 }] }
      : null,
  deleteByUserId: async (userId) => (userId === '1' ? true : null),
};
const mockReceiptRepository = { save: async (receipt) => receipt };

const checkoutService = new CheckoutService({
  // @ts-ignore - no need for full implementation
  cartRepository: mockCartRepository,
  // @ts-ignore - no need for full implementation
  receiptRepository: mockReceiptRepository,
  // @ts-ignore - no need for full implementation
  userRepository: mockUserRepository,
  pricingService,
});

describe('CheckoutService', () => {
  it('🛒 should generate a receipt and clear the cart upon checkout', async () => {
    const userId = '1';
    const receipt = await checkoutService.checkout(userId);
    assert.strictEqual(
      receipt.userId,
      userId,
      'Receipt userId should match provided userId'
    );

    assert.ok(receipt.totalAmount, 'Receipt should have a total amount');
    assert.ok(receipt.items.length > 0, 'Receipt should have items');
  });

  it('❌ should throw an error if cart is not found', async () => {
    // Mock cartRepository to return null for userId 'invalid'
    mockCartRepository.getByUserId = async (userId) => null;

    // Try to checkout and assert that an error is thrown
    await assert.rejects(
      async () => {
        await checkoutService.checkout('invalidUserId');
      },
      { message: 'Cart not found' },
      'Should throw "Cart not found" error when cart is missing'
    );
  });

  it('❌ should throw an error if user is not found', async () => {
    // Забезпечуємо наявність кошика для цього тесту
    mockCartRepository.getByUserId = async (userId) => ({
      items: [{ product: { id: '101', price: 50 }, quantity: 2 }],
    });

    // Мокаємо getById для користувача, щоб він повертав null
    mockUserRepository.getById = async (userId) => null;

    // Тестуємо, чи буде викинута помилка "User not found"
    await assert.rejects(
      async () => {
        await checkoutService.checkout('invalidUserId');
      },
      { message: 'User not found' },
      'Should throw "User not found" error when user is missing'
    );
  });

});
