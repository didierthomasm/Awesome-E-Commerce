const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name'],
          through: { attributes: [] } // This excludes the product_tag attributes in the response
        }
      ]
    });

    res.json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name'],
          through: {attributes: []} // This excludes the product_tag attributes in the response
        }
      ]
    });

    if(!tag) {
      return res.status(404).json( { message: 'Tag not found!' });
    }

    res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const { tag_name } = req.body;

    // Check for tag_name validation first
    if (!tag_name || tag_name.trim() === '') {
      return res.status(400).json({ message: 'Tag name is required!' });
    }

    // If tag_name is valid, proceed to create the tag
    const tag = await Tag.create({ tag_name });

    res.status(201).json(tag);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Tag name already exists!' });
    }
    res.status(500).json(err);
  }
});


router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const { id } = req.params;
    const { tag_name } = req.body;

    if (!tag_name || tag_name.trim() === '') {
      return res.status(400).json({ message: 'Tag name is required!' });
    }

    const [updatedRows] = await Tag.update({ tag_name }, {
      where: { id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'No tag found with that id' });
    }

    const updatedTag = await Tag.findByPk(id);
    res.json(updatedTag);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred while updating the tag.', error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  // delete a tag by its `id` value
  try {
    const { id } = req.params;

    const numberOfRowsDeleted = await Tag.destroy({
      where: { id }
    });

    if (numberOfRowsDeleted === 0) {
      return res.status(404).json({ message: 'No tag found with that id' });
    }

    res.json({ message: `Tag deleted successfully. ${numberOfRowsDeleted} row(s) removed.` });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Error occurred while deleting the tag.', error: err.message });
  }
});


module.exports = router;
