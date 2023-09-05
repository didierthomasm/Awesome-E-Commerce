const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const sequelize = require('../../config/connection');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          through: { attributes: [] },  // this will exclude the intermediate ProductTag data
          attributes: ['id', 'tag_name']
        }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          through: { attributes: [] },  // this will exclude the intermediate ProductTag data
          attributes: ['id', 'tag_name']
        }
      ]
    });

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
/* req.body should look like this...
  {
    product_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
  }
*/

// create new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, category_id, tagIds } = req.body;

    const product = await Product.create({ product_name, price, stock, category_id });

    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);

      return res.status(200).json({ product, productTagIdArr });
    }

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});


// update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tagIds } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    await Product.update(req.body, {
      where: { id },
      transaction
    });

    if (tagIds && tagIds.length) {
      const productTags = await ProductTag.findAll({ where: { product_id: id }, transaction });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      const newProductTags = tagIds
        .filter(tag_id => !productTagIds.includes(tag_id))
        .map(tag_id => ({ product_id: id, tag_id }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !tagIds.includes(tag_id))
        .map(({ id }) => id);

      await ProductTag.destroy({ where: { id: productTagsToRemove }, transaction });
      await ProductTag.bulkCreate(newProductTags, { transaction });
    }

    // If everything was successful, commit the transaction
    await transaction.commit();

    const updatedProduct = await Product.findOne({ where: { id } });
    res.json(updatedProduct);
  } catch (err) {
    // If there's an error, rollback the transaction
    await transaction.rollback();
    console.error(err);
    res.status(400).json(err);
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to delete the product with the specified id
    const numberOfRowsDeleted = await Product.destroy({
      where: { id }
    });

    // Check if any rows were deleted
    if (numberOfRowsDeleted === 0) {
      return res.status(404).json({ message: 'No product found with that id.' });
    }

    // Respond with a success message
    res.json({ message: `Product deleted successfully. ${numberOfRowsDeleted} row(s) removed.` });

  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Error occurred while deleting the product.', error: err.message });
  }
});


module.exports = router;
