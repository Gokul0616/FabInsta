import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState([]);

  const openModal = (options) => {
    setOptions(options);
    setIsVisible(true);
  };

  const closeModal = () => setIsVisible(false);

  return (
    <ModalContext.Provider
      value={{ isVisible, options, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
