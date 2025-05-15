async function getAllProducts({ limit = 10, offset = 0, category, minPrice, maxPrice, search } = {}) {
  try {
    let query = `SELECT products.* FROM products`;
    const values = [];
    const conditions = [];

    // Join for category filtering
    if (category) {
      query += `
        JOIN prod_categories ON products.id = prod_categories."productId"
        JOIN categories ON categories.id = prod_categories."categoryId"
      `;
      conditions.push(`categories.name = $${values.length + 1}`);
      values.push(category);
    }

    // Add price filters
    if (minPrice !== undefined) {
      conditions.push(`products.price >= $${values.length + 1}`);
      values.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push(`products.price <= $${values.length + 1}`);
      values.push(maxPrice);
    }

    // Add search filter
    if (search) {
      conditions.push(`products.title ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }

    // Add WHERE if any condition exists
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    // Add pagination
    query += ` ORDER BY products.id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const { rows } = await client.query(query, values);
    return rows;

  } catch (err) {
    console.error('getAllProducts with filters FAILED:', err);
    throw err;
  }
}
