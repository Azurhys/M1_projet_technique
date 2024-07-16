import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const DetailsArticles = () => {
    const { IDProduit } = useParams();
    const [product, setProduct] = useState(null);
    const [carouselImages, setCarouselImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/produits/${IDProduit}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchCarouselImages = async () => {
            const images = [];
            for (let i = 1; i <= 3; i++) {
                const imageUrl = `http://localhost:3000/image/${IDProduit}-${i}.jpg`;
                try {
                    const response = await fetch(imageUrl, { method: 'HEAD' }); // HEAD request to check existence
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

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className='text-center mt-5'>{product.nom}</h2>
            <div className="row justify-content-center align-items-center" style={{height: '700px'}}>
                <div className="col-md-6">
                    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {carouselImages.map((imageUrl, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img src={imageUrl} className="d-block w-100" style={{height: '10%'}} alt={`Slide ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="prev"
                            style={{ filter: 'invert(1)' }} // Change arrow color to white
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="next"
                            style={{ filter: 'invert(1)' }} // Change arrow color to white
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
                            <button className="btn btn-primary mt-3">
                                <FaShoppingCart className="me-2" /> Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsArticles;