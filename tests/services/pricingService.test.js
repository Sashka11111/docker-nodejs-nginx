const assert = require('node:assert');
const { describe, it } = require('node:test');
const { pricingService } = require('../../src/domain/services/pricing.service');

describe('PricingService', () => {
  it('💰 should calculate cart total with discounts and tax', () => {
    const cart = { items: [{ product: { price: 100 }, quantity: 2 }] };
    // @ts-ignore - no need for full implementation
    const total = pricingService.calculateTotal(cart);
    // Оскільки у вас 200, на 10% знижку, а потім додається 5% податок:
    const expectedTotal = (100 * 2 * 0.9) * 1.05; // Знижка 10% і податок 5%
    assert.strictEqual(total, expectedTotal, 'Total should apply discounts and tax');
  });

  it('🛍️ should calculate individual item total', () => {
    const item = { product: { price: 50 }, quantity: 2 };
    // @ts-ignore - no need for full implementation
    const itemTotal = pricingService.calculateItemTotal(item);
    assert.strictEqual(itemTotal, 100, 'Item total should match price times quantity');
  });

  it('💸 should apply a 5% discount for bulk items (>= 10 quantity)', () => {
    const item = { product: { price: 20 }, quantity: 10 };
    // @ts-ignore - no need for full implementation
    const itemTotal = pricingService.calculateItemTotal(item);
    const expectedItemTotal = 20 * 10 * 0.95; // Знижка 5% при кількості >= 10
    assert.strictEqual(itemTotal, expectedItemTotal, 'Item total should apply bulk discount');
  });

  it('🛒 should calculate total cart price including tax', () => {
    const cart = { items: [{ product: { price: 30 }, quantity: 3 }] };
    // @ts-ignore - no need for full implementation
    const total = pricingService.calculateTotal(cart);
    const expectedTotal = (30 * 3) * 1.05; // Без знижки, тільки податок
    assert.strictEqual(total, expectedTotal, 'Total should include tax');
  });

  it('💰 should apply a 10% discount for cart total > 100', () => {
    const cart = { items: [{ product: { price: 60 }, quantity: 2 }] };
    // @ts-ignore - no need for full implementation
    const total = pricingService.calculateTotal(cart);
    const expectedTotal = (60 * 2 * 0.9) * 1.05; // Знижка 10% для загальної суми більше 100, податок 5%
    assert.strictEqual(total, expectedTotal, 'Total should apply 10% discount and 5% tax');
  });
});
