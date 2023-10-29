import React, { useEffect, useState, useRef } from 'react';
import { fetchImages } from 'Helpers/Api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import { AppDiv } from './App.syled';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  const prevQueryRef = useRef();
  const prevPageRef = useRef();
  useEffect(() => {
    prevQueryRef.current = query;
    prevPageRef.current = page;
  }, [page, query]);

  const prevQuery = prevQueryRef.current;
  const prevPage = prevPageRef.current;

  useEffect(() => {
    if (query === '') {
      return;
    }
    if (query !== prevQuery || page !== prevPage) {
      getFetchImages();
    }
    async function getFetchImages() {
      try {
        const { hits, totalHits } = await fetchImages({
          q: query,
          page: page,
          per_page: 12,
        });
        if (images) {
          setImages(prevState => [...prevState, ...hits]);
          setTotalHits(totalHits);
        }
        if (totalHits === 0) {
          toast.error('Картинок не знайдено');
        } else {
          if (page === 1) {
            toast.info(`Знайдено ${totalHits} картинок`, {
              autoClose: 2000,
            });
          }
          return;
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [images, page, prevPage, prevQuery, query]);

  const handleSearchSubmit = queryProps => {
    console.log(queryProps);
    if (query === queryProps) {
      return;
    }

    setQuery(queryProps);
    setPage(1);
    setImages([]);
    setIsLoading(true);
    setError(null);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleButtonMore = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <AppDiv>
      <ToastContainer transition={Flip} />
      <Searchbar onSubmit={handleSearchSubmit} />

      {error && <p>Error: {error}</p>}

      <ImageGallery images={images} onItemClick={handleImageClick} />

      {isLoading && <Loader />}

      {!isLoading && images.length > 0 && images.length < totalHits && (
        <Button onClick={handleButtonMore} />
      )}

      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}
    </AppDiv>
  );
};

export default App;
