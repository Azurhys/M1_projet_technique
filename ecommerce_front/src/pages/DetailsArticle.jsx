import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const DetailsArticles = () => {
    const { IDProduit } = useParams();
    const [product, setProduct] = useState(null);
    const [carouselImages, setCarouselImages] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isStockAvailable, setIsStockAvailable] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/produits/${IDProduit}`);
                const data = await response.json();
                setProduct(data);
                setIsStockAvailable(data.stock > 0);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchCarouselImages = async () => {
            const images = [];
            for (let i = 1; i <= 3; i++) {
                const imageUrl = `http://localhost:3000/image/${IDProduit}-${i}.jpg`;
                try {
                    const response = await fetch(imageUrl, { method: 'HEAD' });
                    if (response.ok) {
                        images.push(imageUrl);
                    }
                } catch (error) {
                    console.error('Image not found:', imageUrl);
                }
            }
            setCarouselImages(images);
        };

        fetchProduct();
        fetchCarouselImages();
    }, [IDProduit]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const selectedQuantity = parseInt(quantity);

        const totalInCart = cart.reduce((acc, item) => {
            if (item.id === IDProduit) {
                return acc + item.quantity;
            }
            return acc;
        }, 0);

        if (selectedQuantity + totalInCart > product.stock) {
            alert(`Il n'y a plus de stock disponible.`);
            return;
        }
        const existingProductIndex = cart.findIndex(item => item.id === IDProduit);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += selectedQuantity;
        } else {
            cart.push({ id: IDProduit, name: product.nom, price: product.prix, quantity: selectedQuantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produit ajouté au panier');
    };

    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value));
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className='text-center mt-5'>{product.nom}</h2>
            <div className="row justify-content-center align-items-center" style={{ height: '700px' }}>
                <div className="col-md-6">
                    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {carouselImages.map((imageUrl, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img src={imageUrl} className="d-block w-100" style={{ height: '10%' }} alt={`Slide ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="prev"
                            style={{ filter: 'invert(1)' }}
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="next"
                            style={{ filter: 'invert(1)' }}
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-md-6 align-items-center">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <p className="card-text"><strong>Prix:</strong> {product.prix}€</p>
                            <p className="card-text"><strong>Description:</strong> {product.description}</p>
                            {product.stock > 0 ?
                                <p className="card-text text-success"><strong>En stock</strong></p>
                                :
                                <p className="card-text text-danger"><strong>Hors stock</strong></p>
                            }
                            <div className="mb-3">
                                <label className="form-label">Quantité:</label>
                                <input type="number" className="form-control" value={quantity} onChange={handleQuantityChange} min="1" />
                            </div>
                            <button className="btn btn-primary mt-3" onClick={addToCart} disabled={!isStockAvailable}>
                                <FaShoppingCart className="me-2" /> {isStockAvailable ? 'Ajouter au panier' : 'Stock épuisé'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsArticles;