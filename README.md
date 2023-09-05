# Product Management API

A RESTful API built with Node.js, Express, and Sequelize for managing products, categories, and tags.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Demo Video](#demo-video)
- [Contributing](#contributing)
- [License](#license)

## Features

- CRUD operations for Products, Categories, and Tags.
- Associations between products and tags.
- Validation for required fields.

## Installation

1. Clone the repository:
   ```bash
   git clone [repo_url]
   ```
2. Navigate to the project directory:
   ```bash
   cd [project_name]
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Set up your database and modify the `config/connection.js` to match your database configurations.
5. Run the server:
   ```bash
   npm start
   ```

## Usage

Make sure your server is running and use any API testing tool like Postman or use your frontend to make requests to the API.

## Endpoints

### Product

- **GET** `/api/products/`: Fetch all products.
- **GET** `/api/products/:id`: Fetch a single product by ID.
- **POST** `/api/products/`: Add a new product.
- **PUT** `/api/products/:id`: Update a product by ID.
- **DELETE** `/api/products/:id`: Delete a product by ID.

### Category

- **GET** `/api/categories/`: Fetch all categories.
- **GET** `/api/categories/:id`: Fetch a single category by ID.
- **POST** `/api/categories/`: Add a new category.
- **PUT** `/api/categories/:id`: Update a category by ID.
- **DELETE** `/api/categories/:id`: Delete a category by ID.

### Tag

- **GET** `/api/tags/`: Fetch all tags.
- **GET** `/api/tags/:id`: Fetch a single tag by ID.
- **POST** `/api/tags/`: Add a new tag.
- **PUT** `/api/tags/:id`: Update a tag by ID.
- **DELETE** `/api/tags/:id`: Delete a tag by ID.

## Demo Video

Click on the image below to watch the video demonstration:

![Example GIF](./assets/img/ECommerce-readme.gif)  

[Walkthrough Video](https://drive.google.com/file/d/1xlQnD8mmHz-ZJjAa3qdRzmz6QoEhvjkW/view?usp=drive_link).

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request.

## License

This project is licensed under the MIT License.
