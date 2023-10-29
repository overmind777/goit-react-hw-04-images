import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ModalDiv } from './Modal.styled';

const Modal = ({ image, onClose }) => {
  const handleUserPressKey = useCallback(
    e => {
      const { keyCode } = e;
      if (keyCode !== 27) {
        return;
      }
      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserPressKey);
    return () => {
      window.removeEventListener('keydown', handleUserPressKey);
    };
  }, [handleUserPressKey]);

  const handleClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleClick}>
      <ModalDiv>
        <img src={image.largeImageURL} alt={image.tags} />
      </ModalDiv>
    </Overlay>
  );
};

Modal.propTypes = {
  image: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
