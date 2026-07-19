import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Layout, Row, Spin, message } from "antd";
import { ArrowRight, BadgePercent, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssetUrl } from "../config/api";
import { fetchStorefrontHome, searchStorefrontProducts } from "../services/storefront.service";

const { Content } = Layout;
const { Meta } = Card;

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const ProductCard = ({ item, navigate }) => {
  const id = item.id || item._id;
  return (
    <Card
      hoverable
      className="home-card"
      onClick={() => navigate(`/mobiledata/${id}`)}
      cover={<img src={getAssetUrl(item.primaryImage || item.image)} alt={item.name || "Product"} className="home-card-image" />}
    >
      <Meta title={item.name || item.model || "Product"} description={item.brand || item.category || "Marketplace pick"} />
      <div className="home-price-row">
        <strong>{money(item.discountedPrice || item.price)}</strong>
        {Number(item.discount || 0) > 0 && <span>{item.discount}% off</span>}
      </div>
      <div className="home-card-cta">View details</div>
    </Card>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [feed, setFeed] = useState({
    hero: null,
    topDeals: [],
    bestSellers: [],
    trending: [],
    topCategories: [],
    topBrands: [],
    stats: { totalProducts: 0, inStockProducts: 0 }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHome = async () => {
      try {
        const homeFeed = await fetchStorefrontHome({ limit: 12 });
        setFeed(homeFeed);
        setProducts(homeFeed.recentlyAdded || []);
      } catch {
        message.error("Failed to load storefront");
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  const categories = useMemo(
    () =>
      (feed.topCategories || []).length
        ? feed.topCategories.slice(0, 8)
        : Array.from(new Set(products.map((product) => product.category).filter(Boolean)))
            .slice(0, 8)
            .map((name) => ({ name, count: 0 })),
    [feed.topCategories, products]
  );

  const brands = useMemo(
    () =>
      (feed.topBrands || []).length
        ? feed.topBrands.slice(0, 10)
        : Array.from(new Set(products.map((product) => product.brand).filter(Boolean)))
            .slice(0, 10)
            .map((name) => ({ name, count: 0 })),
    [feed.topBrands, products]
  );

  const hero = feed.hero || products[0] || {};
  const topDeals = (feed.topDeals?.length ? feed.topDeals : products).slice(0, 4);
  const bestSellers = (feed.bestSellers?.length ? feed.bestSellers : products).slice(0, 8);
  const trending = (feed.trending?.length ? feed.trending : products).slice(0, 6);

  const quickSearch = async (brand) => {
    setLoading(true);
    try {
      const result = await searchStorefrontProducts({ q: brand, sort: "popular", page: 1, limit: 12 });
      setProducts(result.items || []);
    } catch {
      message.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        <section className="home-hero">
          <div className="home-hero-copy">
            <span className="home-eyebrow">Launch-ready marketplace</span>
            <h1>ShopEase</h1>
            <p>Discover phones, electronics, daily essentials, trusted sellers, secure checkout, and fast delivery from one modern storefront.</p>
            <div className="home-hero-actions">
              <Button type="primary" size="large" onClick={() => navigate("/product")}>Shop deals</Button>
              <Button size="large" onClick={() => navigate("/seller")}>Start selling</Button>
            </div>
            <div className="home-service-row">
              <span><Truck size={18} /> Fast dispatch</span>
              <span><ShieldCheck size={18} /> Secure payments</span>
              <span><Undo2 size={18} /> Easy returns</span>
            </div>
          </div>
          <div className="home-hero-product" onClick={() => hero._id && navigate(`/mobiledata/${hero._id}`)}>
            <div>
              <span className="deal-label">Deal of the day</span>
              <h2>{hero.name || "Fresh deals are waiting"}</h2>
              <p>{hero.brand || hero.category || "Curated picks from approved sellers"}</p>
              <strong>{hero.price ? money(hero.discountedPrice || hero.price) : "Explore today's offers"}</strong>
            </div>
            {hero.primaryImage || hero.image ? <img src={getAssetUrl(hero.primaryImage || hero.image)} alt={hero.name} /> : null}
          </div>
        </section>

        <section className="home-deals-strip">
          {topDeals.map((item) => (
            <article key={item.id || item._id} className="home-deal-tile" onClick={() => navigate(`/mobiledata/${item.id || item._id}`)}>
              <img src={getAssetUrl(item.primaryImage || item.image)} alt={item.name} />
              <div>
                <span className="deal-label"><BadgePercent size={13} /> Deal</span>
                <h4>{item.name}</h4>
                <p>{money(item.discountedPrice || item.price)}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="home-categories-block">
          <div className="section-header">
            <h2>Shop by category</h2>
            <Button type="link" onClick={() => navigate("/categories")}>All categories <ArrowRight size={15} /></Button>
          </div>
          <div className="home-category-grid">
            {categories.map((category) => (
              <button key={category.name} className="home-category-card" onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}>
                <h4>{category.name}</h4>
                <span>{category.count ? `${category.count} products` : "View products"}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-brands">
          <h2>Popular brands</h2>
          <div className="brand-grid">
            {brands.map((brand) => (
              <button key={brand.name} className="brand-chip" onClick={() => quickSearch(brand.name)}>{brand.name}</button>
            ))}
          </div>
        </section>

        <section className="home-featured">
          <div className="section-header">
            <h2>Best sellers</h2>
            <Button type="link" onClick={() => navigate("/product?sort=popular")}>See more <ArrowRight size={15} /></Button>
          </div>
          {loading ? (
            <div className="home-loading"><Spin size="large" /></div>
          ) : (
            <Row gutter={[14, 14]} className="home-grid">
              {bestSellers.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id || item._id}>
                  <ProductCard item={item} navigate={navigate} />
                </Col>
              ))}
            </Row>
          )}
        </section>

        <section className="home-featured">
          <div className="section-header">
            <h2>Trending now</h2>
            <Button type="link" onClick={() => navigate("/product?sort=rating")}>Top rated <ArrowRight size={15} /></Button>
          </div>
          <Row gutter={[14, 14]} className="home-grid">
            {trending.map((item) => (
              <Col xs={24} sm={12} md={8} lg={4} key={`trend-${item.id || item._id}`}>
                <ProductCard item={item} navigate={navigate} />
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  );
};

export default Home;
