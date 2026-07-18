import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStorefrontCategories } from "../services/storefront.service";
import { getAssetUrl } from "../config/api";
import "../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorefrontCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="categories-page">
      <header className="categories-hero">
        <span>SHOP BY DEPARTMENT</span>
        <h1>Find what you need</h1>
        <p>Explore products from verified sellers across every category.</p>
      </header>
      {loading ? (
        <p className="categories-status">Loading categories...</p>
      ) : categories.length ? (
        <section className="categories-grid" aria-label="Product categories">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="category-discovery-card"
            >
              {category.image ? (
                <img src={getAssetUrl(category.image)} alt={category.name} />
              ) : (
                <div className="category-discovery-placeholder">{category.name.charAt(0)}</div>
              )}
              <div>
                <h2>{category.name}</h2>
                <p>{category.productCount} {category.productCount === 1 ? "product" : "products"}</p>
                {category.lowestPrice > 0 && <small>Starting at Rs. {category.lowestPrice}</small>}
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <p className="categories-status">No categories are available yet.</p>
      )}
    </main>
  );
};

export default Categories;
