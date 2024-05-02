import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, handleAddToCart }) => {
  const imgSrc = product.product_img || (product.product_images && product.product_images.length > 0 ? `data:image/png;base64,${product.product_images[0].data}` : null);

  // Check if product date is from this month
  const isNewProduct = () => {
    const productDate = new Date(product.date);
    const currentDate = new Date();
    return productDate.getMonth() === currentDate.getMonth() && productDate.getFullYear() === currentDate.getFullYear();
  };

  return (
    <li key={product.id} className="product-card-create">
      <div className="new-badge-container" style={{ marginLeft: '12rem' }}>
        {isNewProduct() && (
          <img style={{ height: '30px', width: '40px' }} src={require('../Images/new.png')} alt="New" />
        )}
      </div>
      <Link to={`/product/${product._id}`} >
        <img
          className="imagess"
          src={imgSrc}
          alt={product.product_name}
        /></Link>
        <p className="product-title_1">{product.product_name}</p>
      
      <p>
        <span className="product-discount">- {product.offer}% </span>
        <span className="selling-price">{(product.product_mrp * (1 - product.offer / 100)).toFixed(2)}</span>
      </p>
      <p className="product-mrp">MRP: <s>{(product.product_mrp * 1).toFixed(2)}</s></p>
      <p className="product-quantity">Pack off: {product.quantity}</p>
      <button className="cta-button" onClick={() => handleAddToCart(product)}>
        Add to cart
      </button>
    </li>
  );
};

export default ProductCard;
