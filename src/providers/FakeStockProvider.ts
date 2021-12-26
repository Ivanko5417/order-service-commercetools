
export class FakeStockProvider {
  isEnoughItems(): boolean {
    return Math.random() >= 0.2;
  }
}
