import { useEffect } from 'react';

const VideoPlayer = ({ videoSrc, closeVideoPlayer }) => {
    const title = videoSrc.split('/').pop(); // Extraer el nombre del archivo del video

   useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace') {
        closeVideoPlayer();
      }
    };

    
    window.addEventListener('keydown', handleKeyDown);

    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeVideoPlayer]);
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90">
        {/* Fondo semitransparente */}
        <div className="relative bg-gray-900 p-4 rounded-lg shadow-lg max-w-4xl w-full">
          {/* Título del video */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-semibold truncate">
              {title}
            </h2>
            <button
              onClick={closeVideoPlayer}
              className="w-8 h8 text-white-600 hover:bg-red-600 text-lg font-bold bg-gray-600 rounded-full"
              aria-label="Close video player"
            >
              ✕
            </button>
          </div>
          {/* Video */}
          <video
            src={videoSrc}
            controls
            className="rounded-lg w-full h-auto border border-gray-700"
            autoPlay
          />
        </div>
      </div>
    );
  };
  
  export default VideoPlayer;
  