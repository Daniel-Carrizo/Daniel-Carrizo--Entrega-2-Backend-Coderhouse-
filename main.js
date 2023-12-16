const fs = require('fs/promises');

class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  // Method to add a product to the array with auto-incremented id
  async addProduct(productData) {
    // Increment the static id for each new product
    ProductManager.id++;
    
    // Create a new product object with the provided data and the auto-incremented id
    const newProduct = {
      ...productData,
      id: ProductManager.id
    };

    // Add the new product to the products array
    this.products.push(newProduct);
    
    // Save the updated products array to the file after adding a new product
    await this.writeToFile();

    // Return the newly added product with the assigned id
    return newProduct;
  }

  // Method to get the list of products
  async getProducts() {
    // Read products from the file before returning the list
    await this.readFromFile();
    return this.products;
  }

  // Method to check if a product with a specific id exists
  async getProductById(id) {
    // Read products from the file before searching
    await this.readFromFile();

    // Find the product with the specified id
    const foundProduct = this.products.find((product) => product.id === id);

    // Log whether the product was found or not
    if (!foundProduct) {
      console.log('Not found');
    } else {
      console.log('Exists');
    }
  }

  // Method to write the products array to the file
  async writeToFile() {
    try {
      await fs.writeFile('products.json', JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error writing to file:', error.message);
    }
  }

  // Method to read products from the file into the products array
  async readFromFile() {
    try {
      const data = await fs.readFile('products.json', 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or an error occurs, handle it here
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
  // Add a new product
  await productManager.addProduct({
    title: 'Test Product',
    description: 'This is a test product',
    price: 200,
    thumbnail: 'Test Image',
    code: 'test123',
    stock: 10
  });

  // Get the list of products and log it
  const products = await productManager.getProducts();
  console.log(products);

  // Check if a product with a specific ID exists
  await productManager.getProductById(1); // Assuming you want to check for product with ID 1
})();
