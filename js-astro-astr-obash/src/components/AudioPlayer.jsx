import { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ audioSrc, closePlayer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const title = audioSrc.split('/').pop();

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace') {
        closePlayer();
      }
      if (event.key === 'Control') {
        togglePlay();
      }
    };

    
    window.addEventListener('keydown', handleKeyDown);

    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closePlayer, isPlaying]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg">{title || 'Audio Player'}</h2>
          <button
            className="bg-gray-600 w-8 h-8 text-white text-xl hover:bg-red-600 rounded-full"
            onClick={closePlayer} // Cierra el reproductor cuando se hace clic en el botón
          >
            X
          </button>
        </div>
        <audio ref={audioRef} src={audioSrc} />
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={togglePlay}
            className="text-white bg-blue-600 p-2 rounded hover:bg-blue-700 transition duration-300"
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          <div className="flex items-center space-x-2">
            <i className="text-white">Volume</i>
            <input
              type="range"
              className="w-24"
              onChange={(e) => (audioRef.current.volume = e.target.value / 100)}
              defaultValue="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
