import { useState, useEffect, useRef } from 'react';
import Modal from './Modal'; 
import AudioPlayer from './AudioPlayer'; 
import VideoPlayer from './VideoPlayer';
import fileSystem from '../utils/fileSystem';


const Terminal = () => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dirHistory, setDirHistory] = useState([{ path: ' ~' }]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Estado para abrir el modal
  const [playerOpen, setPlayerOpen] = useState(false); // Estado para abrir el modal
  const [videoOpen,setVideoOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(''); // Estado para la URL de la imagen
  const [audioSrc, setAudioSrc] = useState(''); // Estado para la URL del archivo de audio
  const [videoSrc, setVideoSrc] = useState('')
  const outputRef = useRef(null);

  const currentDir = dirHistory[dirHistory.length - 1].path;

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const resolvePath = (dir, relativePath) => {
    if (relativePath === '..') {
      return dir.split('/').slice(0, -1).join('/') || '/';
    }
    if (relativePath.startsWith('/')) {
      return relativePath;
    }
    return `${dir}/${relativePath}`.replace(/\/+/g, '/'); // Manejo de slashes redundantes
  };

  const handleCommand = (command) => {
    let NotInHistory;
    const trimmedCommand = command.trim();
    const [baseCommand, ...args] = trimmedCommand.split(' ');
    let response = '';

    switch (baseCommand) {
      case 'ls': {
        const dirContent = fileSystem[currentDir] || [];
        response = (
          <div>
            {dirContent.map((item, index) => {
              const fullPath = `${currentDir}/${item}`;
              const isDirectory = Array.isArray(fileSystem[fullPath]); // Verifica si es un directorio
              return (
                <span
                  key={index}
                  className={isDirectory ? 'text-blue-600 ml-2' : 'text- ml-2'}
                >
                  {item}{' '}
                </span>
              );
            })}
          </div>
        );
        break;
      }
      case 'pwd':
        response = currentDir.replace('~', '/home/user');
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'help':
        response = `
          Available Commands:
          -------------------
          - ls            : List directory contents
          - pwd           : Print working directory
          - date          : Show current date and time
          - help          : Display this help message
          - clear         : Clear the terminal screen
          - cd            : Change directory
          - cat           : Display file content
          - history       : Show command history

          Aliases:
          --------
          - open-image    : Open an image file
          - play-audio    : Play an audio file
          - play-video    : Play a video file
              `;
        break;
        case 'echo':
          const environmentVariables = {
            $PATH: '/astro:/react:/tailwind:/postcss:/npm:/javascript',
            $AUTHOR: 'jjunlob074',
            $HOME: 'https://github.com/jjunlob074/ASTRObash',
            $NOW: new Date().toLocaleString(),
            $RANDOM: Math.floor(Math.random() * 1000).toString(),
          };
          response = args
          .join(' ')
          .replace(/["']/g, '') 
          .replace(/\$(\w+)/g, (match, varName) => environmentVariables[`$${varName}`] || match); // Sustituye variables de entorno
        break;    
      case 'history':
        response = commandHistory
          .map((command, index) => `${index + 1}  ${command}`)
          .join('\n');
        break;
      case 'clear':
        setCommandHistory((prevHistory) => [...prevHistory, trimmedCommand]);
        setOutput([]);
        setInput('');
        return;
      case 'cd': {
        const newDir = args.join(' ').trim();
        const targetPath = resolvePath(currentDir, newDir);

        if (newDir === '' || newDir === '/') {
          setDirHistory((prevHistory) => [...prevHistory, { path: ' ~' }]);
        } else if (fileSystem[targetPath] && Array.isArray(fileSystem[targetPath])) {
          setDirHistory((prevHistory) => [...prevHistory, { path: targetPath }]);
        } else {
          response = `bash: cd: ${newDir}: No such directory`;
        }
        break;
      }
      case 'cat': {
        const fileName = args.join(' ').trim();
        const filePath = resolvePath(currentDir, fileName);

        if (fileSystem[filePath] && typeof fileSystem[filePath] === 'string') {
          response = fileSystem[filePath];
        } else {
          response = `bash: cat: ${fileName}: No such file`;
        }
        break;
      }
      case 'rm': {
        const whatAreYouDoing = args[0] + args[1]; // Concatenar los argumentos para verificar
        if (whatAreYouDoing === '-rf/') {
          response = 'bash: Your computer will be destroyed... just kidding! 😂';
          response += ' ¿What are you doing?';
        } else {
          response = 'bash: You dont have permission to delete anything.';
        }
        break;
      }
      case 'open-image': {
        const imageName = args.join(' ').trim();
        const imagePath = resolvePath(currentDir, imageName);
        if (fileSystem[imagePath] && typeof fileSystem[imagePath] === 'string') {
          setImageSrc(fileSystem[imagePath]); // Si la imagen existe, se establece la URL
          setModalOpen(true); // Abrimos el modal
          response = `Opening image: ${imageName}`;
        } else {
          response = `bash: open-image: ${imageName}: No such file`;
        }
        break;
      }
      case 'play-audio': {
        const audioFile = args.join(' ').trim();
        const audioPath = resolvePath(currentDir, audioFile);
        if (fileSystem[audioPath] && typeof fileSystem[audioPath] === 'string') {
          setAudioSrc(fileSystem[audioPath]);
          setPlayerOpen(true)
          response = `Playing audio: ${audioFile}`;
        } else {
          response = `bash: play-audio: ${audioFile}: No such file`;
        }
        break;
      }
      case 'play-video': {
        const videoFile = args.join(' ').trim();
        const videoPath = resolvePath(currentDir, videoFile);
        if (fileSystem[videoPath] && typeof fileSystem[videoPath] === 'string') {
          setVideoSrc(fileSystem[videoPath]); // Configura la URL del video
          setVideoOpen(true); // Abre el reproductor de video
          response = `Playing video: ${videoFile}`;
        } else {
          response = `bash: play-video: ${videoFile}: No such file`;
        }
        break;
      }
      case 'man':
        response = 'bash: try command "help" for commands availables';
        break;
      case '': {
        NotInHistory = true;
        break;
      }
      default:
        response = `bash: ${baseCommand}: command not found`;
    }

    setOutput((prevOutput) => [
      ...prevOutput,
      { command: trimmedCommand, response, dir: currentDir },
    ]);
    setInput('');

    // si no es un comando válido, no lo quiero en el historial
    if (NotInHistory) return;
    if (response !== `bash: ${baseCommand}: command not found`) {
      setCommandHistory((prevHistory) => [...prevHistory, trimmedCommand]);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageSrc('');
  };
  const closePlayer = () => {
    setPlayerOpen(false);
    setAudioSrc('');
  };
  const closeVideoPlayer = () => {
    setVideoOpen(false);
    setVideoSrc('');
  };

  return (
    <div className="h-screen w-full bg-bash text-white p-4 flex flex-col flex-start"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#38112e #38112e',
      }}>
      {/* Área de salida */}
      <div className="output overflow-y-auto whitespace-pre-wrap break-words sm:text-2xl mb-4" ref={outputRef}>
        {output.map((entry, index) => (
          <div className="mb-2" key={index}>
            <div>
              <span className="text-green-500">user@astro</span>
              <span className="text-white">:</span>
              <span className="text-blue-600 font-semibold">{entry.dir}</span>
              <span className="text-white">$ {entry.command}</span>
            </div>
            {entry.response && (
              <div className="text-white m-2">{entry.response}</div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && <Modal imageSrc={imageSrc} closeModal={closeModal} />}

      {/* Reproductor de audio */}
      {playerOpen && <AudioPlayer audioSrc={audioSrc} closePlayer={closePlayer}/>}
      
      {/* Reproductor de Video */}
      {videoOpen && (<VideoPlayer videoSrc={videoSrc} closeVideoPlayer={closeVideoPlayer} />)}

      {/* Área de entrada */}
      <div className="prompt flex items-center sm:text-2xl">
        <span className="text-green-500">user@astro</span>
        <span className="text-white">:</span>
        <span className="text-blue-600 font-semibold pl-1">{currentDir}</span>
        <span className="text-white mr-2">$</span>
        <input
          type="text"
          id="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setHistoryIndex(-1); // Reinicia el índice después de ejecutar un comando
            } else if (e.key === 'ArrowUp') {
              // Navegar hacia atrás en el historial
              if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
              }
            } else if (e.key === 'ArrowDown') {
              // Navegar hacia adelante en el historial
              if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
              } else {
                // Salir del historial
                setHistoryIndex(-1);
                setInput('');
              }
            }
          }}
          className="bg-transparent border-none outline-none text-white w-full sm:text-2xl font-semibold"
          autoComplete="off"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;
