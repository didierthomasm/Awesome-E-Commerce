const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name'],
        }
      ]
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found!' });
    }

    res.json(categories);
  } catch (err) {
    console.error(err);  // Log the error for debugging purposes
    res.status(500).json({ message: 'Error occurred while fetching categories.', error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name']
        }
      ]
    });

    if (!category) {
      return res.status(404).json( { message: 'Category not found!' });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const { category_name } = req.body;

    if (!category_name || category_name.trim() === '') {
      return res.status(400).json( {message: 'Category name is required!' });
    }

    const category = await Category.create( { category_name });

    res.status(201).json(category);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json( { message: 'Category name already exists!' });
    }
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name || category_name.trim() === '') {
      return res.status(400).json( { message: 'Category name is required!' });
    }

    const [updateRows] = await Category.update( {category_name}, {
      where: {id}
    });

    if (updateRows === 0) {
      return res.status(404).json( { message: 'No category found with that id' });
    }

    const updatedCategory = await Category.findByPk(id);
    res.json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json( { message: 'Error occurred while updating the category', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const { id } = req.params;

    const numberOfRowsDeleted = await Category.destroy({
      where: { id }
    });

    if (numberOfRowsDeleted === 0) {
      return res.status(404).json({ message: 'No category found with that id' });
    }

    res.json({ message: `Category deleted successfully. ${numberOfRowsDeleted} row(s) removed.` });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Error occurred while deleting the category.', error: err.message });
  }
});

module.exports = router;
