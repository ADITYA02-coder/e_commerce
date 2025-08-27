import React from 'react'
import { useState }  from 'react';
import productData from './Data.json';

const filterData = () => {
    const [selectedBrand, setSelectedBrand] = useState('All');
    // Extract unique brands from product data  
    const allBrands = [...new Set(productData.map(product => product.brand))];

  // Filtered products
  const filteredProducts = selectedBrand === 'All'
    ? productData
    : productData.filter(product => product.brand === selectedBrand);
  return (
    <div>
       <h2>Filter by Brand</h2>
      <div>
        <button onClick={() => setSelectedBrand('All')}>All</button>
        {allBrands.map(brand => (
          <button key={brand} onClick={() => setSelectedBrand(brand)}>
            {brand}
          </button>
        ))}
      </div>

      <h3>Products:</h3>
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>{product.name} ({product.brand})</li>
        ))}
      </ul>
    </div>
  )
}

export default filterData
