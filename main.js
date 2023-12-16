const fs = require('fs/promises'); // Import the promises version of the fs module

class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  async addProduct(title, description, price, image, code, stock) {
    ProductManager.id++;
    this.products.push({ title, description, price, image, code, stock, id: ProductManager.id });

    await this.writeToFile(); // Save products to file after adding a new product
  }

  async getProducts() {
    await this.readFromFile(); // Read products from file before returning
    return this.products;
  }

  async getProductById(id) {
    await this.readFromFile(); // Read products from file before searching

    const foundProduct = this.products.find((product) => product.id === id);

    if (!foundProduct) {
      console.log('Not found');
    } else {
      console.log('Exists');
    }
  }

  async writeToFile() {
    try {
      await fs.writeFile('products.json', JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error writing to file:', error.message);
    }
  }

  async readFromFile() {
    try {
      const data = await fs.readFile('products.json', 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or an error occurs, it will be handled here
      if (error.code === 'ENOENT') {
        console.log('File not found. Creating a new one.');
      } else {
        console.error('Error reading from file:', error.message);
      }
    }
  }
}

// Create an instance of ProductManager
const productManager = new ProductManager();

// Example usage
(async () => {
  await productManager.addProduct('titulo1', 'descripcion1', 1000, 'imagen1', 'abc123', 5);
  await productManager.addProduct('titulo2', 'descripcion2', 1000, 'imagen2', 'abc123', 5);

  const products = await productManager.getProducts();
  console.log(products);

  // Check if a product with a specific ID exists
  await productManager.getProductById(1); // Assuming you want to check for product with ID 1
})();
