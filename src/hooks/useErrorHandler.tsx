import { useState } from 'react';

type ErrorHandlingResult = {
  errorMessage: string;
  isModalOpen: boolean;
  handleServerError: (error: any) => void;
  closeModal: () => void;
  openModal: () => void;
};

export const useErrorHandler = (): ErrorHandlingResult => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServerError = (error: any) => {
    console.error('Server error:', error);
    let message = 'An unexpected error occurred';
    if (typeof(error.message) === 'string') {
      try {
        const errorObj = JSON.parse(error.message);
        if (Array.isArray(errorObj) && errorObj.length > 0 && errorObj[0].message) {
          message = errorObj[0].message;
        }
      } catch {
        message = error.message;
      }
    }
    setErrorMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  }

  return { errorMessage, isModalOpen, handleServerError, closeModal, openModal };
};
