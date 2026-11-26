import { useEffect } from 'react';

const Modal = ({ imageSrc, closeModal }) => {
  // Extraer el nombre de la imagen de la URL
  const imageName = imageSrc.split('/').pop();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace') {
        closeModal();
      }
    };

    
    window.addEventListener('keydown', handleKeyDown);

    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-gray-800 rounded-lg shadow-lg border-2 border-gray-600">
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded-t-lg">
          {/* Nombre de la imagen */}
          <div className="text-center text-white font-semibold flex-1">
            {imageName}
          </div>
          <button
            onClick={closeModal}
            className="text-white w-8 h-8 text-xl hover:bg-red-600 rounded-full ml-auto bg-gray-700"
          >
            ×
          </button>
        </div>
        <img src={imageSrc} alt="Modal" className="max-w-full max-h-full rounded-b-lg border-8 border-black" />
      </div>
    </div>
  );
};

export default Modal;
