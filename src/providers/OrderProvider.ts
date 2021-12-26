import { Order } from '@commercetools/typescript-sdk';
import { FakeOmsProvider, FakeStockProvider } from 'providers';
import { OrderDetails } from '../types/order-details';
import { CommerceToolsProvider } from './CommerceToolsProvider';

/**
 * Handle all communication with the commerce tools
 */
export class OrderProvider {
  constructor(
    private readonly cts: CommerceToolsProvider,
    private readonly stock?: FakeStockProvider,
    private readonly oms?: FakeOmsProvider
  ) {}

  async createOrder(cartId: string): Promise<Order> {
    console.log('Order Provider: Create Order Invoking...');

    if (this.stock && !this.stock.isEnoughItems()) {
      throw new Error('No enough items in stock');
    }
    const { version } = await this.cts.getCart(cartId);
    const order = await this.cts.createOrderByCart(cartId, version);

    if (order.orderState == 'Open' && this.oms) {
      await this.oms.reserveOrder(order);
    }

    return order;
  }

  async updateOrder(order: Order) {
    console.log('Order Provider: Update Order Invoking...');

    return this.cts.updateOrder(order);
  }
}
