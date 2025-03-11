// src/pages/ProductDetails.jsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProductDetails() {
  const { productId } = useParams();
  const product = useSelector((state) =>
    state.products.find((prod) => prod.id === parseInt(productId))
  );

  if (!product) {
    return <p>Product not found!</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <p className="text-lg">${product.price}</p>
      <p className="mt-4">{product.description || 'Description not available'}</p>
    </div>
  );
}

export default ProductDetails;
