import booksData from '../mockData/books.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BookService {
  constructor() {
    this.books = [...booksData];
  }

  async getAll(filters = {}) {
    await delay(300);
    
    let filteredBooks = [...this.books];
    
    // Apply genre filter
    if (filters.genres && filters.genres.length > 0) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.some(g => filters.genres.includes(g))
      );
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply rating filter
    if (filters.minRating) {
      filteredBooks = filteredBooks.filter(book => book.rating >= filters.minRating);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          filteredBooks.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredBooks.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
          break;
        case 'title':
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'author':
          filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
          break;
        default:
          break;
      }
    }
    
    return [...filteredBooks];
  }

  async getById(id) {
    await delay(200);
    const book = this.books.find(b => b.id === id);
    if (!book) {
      throw new Error('Book not found');
    }
    return { ...book };
  }

  async getFeatured() {
    await delay(250);
    const featured = this.books.filter(book => book.featured);
    return [...featured];
  }

  async getTrending() {
    await delay(300);
    const trending = this.books
      .filter(book => book.rating >= 4.0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    return [...trending];
  }

  async getByGenre(genre) {
    await delay(250);
    const books = this.books.filter(book => 
      book.genre.includes(genre)
    );
    return [...books];
  }

  async getRecommendations(genres = [], limit = 6) {
    await delay(400);
    let recommendations = [];
    
    if (genres.length > 0) {
      recommendations = this.books.filter(book => 
        book.genre.some(g => genres.includes(g))
      );
    } else {
      recommendations = this.books.filter(book => book.rating >= 4.0);
    }
    
    // Shuffle and limit results
    recommendations = recommendations
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
      
    return [...recommendations];
  }

  async create(book) {
    await delay(300);
    const newBook = {
      ...book,
      id: Date.now().toString(),
      rating: 0,
      ratingCount: 0
    };
    this.books.push(newBook);
    return { ...newBook };
  }

  async update(id, data) {
    await delay(300);
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Book not found');
    }
    this.books[index] = { ...this.books[index], ...data };
    return { ...this.books[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Book not found');
    }
    this.books.splice(index, 1);
    return { success: true };
  }

  async getGenres() {
    await delay(200);
    const allGenres = this.books.flatMap(book => book.genre);
    const uniqueGenres = [...new Set(allGenres)].sort();
    return uniqueGenres;
  }
}

export default new BookService();