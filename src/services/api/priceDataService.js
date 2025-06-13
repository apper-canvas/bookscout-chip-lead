import priceData from '../mockData/priceData.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PriceDataService {
  constructor() {
    this.priceData = [...priceData];
  }

  async getAll() {
    await delay(300);
    return [...this.priceData];
  }

  async getById(id) {
    await delay(200);
    const price = this.priceData.find(p => p.id === id);
    if (!price) {
      throw new Error('Price data not found');
    }
    return { ...price };
  }

  async getByBookId(bookId) {
    await delay(250);
    const prices = this.priceData.filter(p => p.bookId === bookId);
    return [...prices];
  }

  async getLowestPrice(bookId) {
    await delay(200);
    const prices = this.priceData.filter(p => p.bookId === bookId && p.inStock);
    if (prices.length === 0) {
      return null;
    }
    
    const lowest = prices.reduce((min, current) => 
      current.price < min.price ? current : min
    );
    return { ...lowest };
  }

  async create(priceData) {
    await delay(300);
    const newPriceData = {
      ...priceData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    this.priceData.push(newPriceData);
    return { ...newPriceData };
  }

  async update(id, data) {
    await delay(300);
    const index = this.priceData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Price data not found');
    }
    this.priceData[index] = { 
      ...this.priceData[index], 
      ...data, 
      lastUpdated: new Date().toISOString() 
    };
    return { ...this.priceData[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.priceData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Price data not found');
    }
    this.priceData.splice(index, 1);
    return { success: true };
  }

  async updatePricesForBook(bookId, newPrices) {
    await delay(400);
    // Remove old prices for this book
    this.priceData = this.priceData.filter(p => p.bookId !== bookId);
    
    // Add new prices
    const updatedPrices = newPrices.map(price => ({
      ...price,
      id: Date.now().toString() + Math.random(),
      bookId,
      lastUpdated: new Date().toISOString()
    }));
    
    this.priceData.push(...updatedPrices);
    return [...updatedPrices];
  }

  async getPriceHistory(bookId, retailer, days = 30) {
    await delay(300);
    // Mock price history data
    const basePrice = this.priceData.find(p => p.bookId === bookId && p.retailer === retailer)?.price || 20;
    const history = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price fluctuation
      const variation = (Math.random() - 0.5) * 4; // ±$2 variation
      const price = Math.max(basePrice + variation, 5);
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return history;
  }
}

export default new PriceDataService();