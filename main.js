const fs = require('fs');

class ProductManager {
    static id = 0;

    constructor(filePath = 'products.json') {
        this.path = filePath;
        this.products = this.readDataFromFile();
    }

    validateProperty = (property, propertyName) => {
        if (!property) {
            throw new Error(`Invalid ${propertyName}. ${propertyName} must be provided.`);
        }
    };

    readDataFromFile = () => {
        try {
            return JSON.parse(fs.readFileSync(this.path, 'utf8'));
        } catch (error) {
            return [];
        }
    };

    writeDataToFile = (data) => {
        fs.writeFileSync(this.path, JSON.stringify(data, null, 2), 'utf8');
    };

    addProduct = (title, description, price, thumbnail, code, stock) => {
        this.validateProperty(title, 'title');
        this.validateProperty(description, 'description');
        this.validateProperty(price, 'price');
        this.validateProperty(thumbnail, 'thumbnail');
        this.validateProperty(code, 'code');
        this.validateProperty(stock, 'stock');

        if (this.products.some((product) => product.code === code)) {
            throw new Error('Product with the same code already exists.');
        }

        ProductManager.id++;
        const newProduct = { title, description, price, thumbnail, code, stock, id: ProductManager.id };
        this.products.push(newProduct);
        this.writeDataToFile(this.products);
    };

    getProducts = () => this.products;

    getProductById = (id) => {
        const product = this.products.find((producto) => producto.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    };

    updateProduct = (id, updatedProduct) => {
        const index = this.products.findIndex((product) => product.id === id);

        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct, id };
            this.writeDataToFile(this.products);
        } else {
            throw new Error('Product not found');
        }
    };

    deleteProduct = (id) => {
        const updatedProducts = this.products.filter((product) => product.id !== id);

        if (updatedProducts.length === this.products.length) {
            throw new Error('Product not found');
        }

        this.writeDataToFile(updatedProducts);
    };
}

// Example usage
const productManager = new ProductManager();

console.log('Initial Products:', productManager.getProducts());

productManager.addProduct('test product', 'This is a test product', 200, 'No image', 'abc123', 25);

console.log('Products after adding:', productManager.getProducts());

console.log('Product by Id:', productManager.getProductById(1));

productManager.updateProduct(1, { price: 250 });

console.log('Products after update:', productManager.getProducts());

productManager.deleteProduct(1);

console.log('Products after delete:', productManager.getProducts());
