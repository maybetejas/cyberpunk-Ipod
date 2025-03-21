import { useEffect, useState, useRef } from 'react';
import styles from './Scree.module.css';

const Screen = ({ audioRef, currentSong, menuVisible, selectedIndex, menuItems, selectedItem, setMenuVisible }) => {
  const [progress, setProgress] = useState(0);
  const isDraggingRef = useRef(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const srcRef = useRef(null);
  const animationFrameId = useRef(null); // Added useRef for animation frame ID

  useEffect(() => {
    if (audioRef.current) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (!srcRef.current) {
        srcRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      }
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
      }

      srcRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext('2d') : null; // Check if canvas exists before getting context

      const renderFrame = () => {
        if (ctx) { // Check if ctx exists before rendering
          animationFrameId.current = requestAnimationFrame(renderFrame); // Store animation frame ID

          analyserRef.current.getByteFrequencyData(dataArray);

          const WIDTH = canvas.width;
          const HEIGHT = canvas.height;

          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          const barWidth = (WIDTH / bufferLength) * 2.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];

            const r = barHeight + (25 * (i / bufferLength));
            const g = 250 * (i / bufferLength);
            const b = 50;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
          }
        }
      };

      if (showVisualizer) {
        renderFrame();
      } else {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current); // Cancel animation frame when hiding visualizer
          animationFrameId.current = null;
        }
      }

      const updateProgress = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
        }
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current); // Cancel animation frame on unmount
        }
      };
    }
  }, [audioRef, currentSong, showVisualizer]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    handleMouseMove(e);
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current && audioRef.current && audioRef.current.duration) {
      const progressBar = e.currentTarget.parentElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = clickX / rect.width;

      if (newProgress >= 0 && newProgress <= 1) {
        audioRef.current.currentTime = newProgress * audioRef.current.duration;
        setProgress(newProgress * 100);
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    setMenuVisible(false);
  }, [selectedItem, setMenuVisible]);

  return (
    <div className={styles.screen}>
      {selectedItem && selectedItem !== 'HOME' && (
        
        
        <div className={styles.selectedItem}>
          
          
          {selectedItem === 'MUSIC' ? (
            
            
            <div className={styles.musicPlayer}>
              {!showVisualizer && (
                <img onClick={() => setShowVisualizer(!showVisualizer)} src={currentSong.cover} alt="album cover" />
              )}
              {showVisualizer && (
                <canvas
                onClick={() => setShowVisualizer(!showVisualizer)}
                  ref={canvasRef}
                  width={300}
                  height={200}
                  style={{ width: '80%', height: 'auto' }}
                />
              )}
              <h3>{currentSong.title}</h3>
              <h4>{currentSong.artist}</h4>
              <div
                className={styles.progress}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                <div className={styles.circle} style={{ left: `${progress}%` }}></div>
              </div>
              {/* <button className='visualBtn' onClick={() => setShowVisualizer(!showVisualizer)}>
                {showVisualizer ? 'Hide Visualizer' : 'Show Visualizer'}
              </button> */}
              <audio ref={audioRef} autoPlay src={`./${currentSong.src}`} style={{ display: 'none' }}></audio>
            </div>
        
      
      
      ) : (
            <h1>{selectedItem}</h1>
          )}
        </div>
      )}
      <div className={`${styles.menu} ${menuVisible ? styles.visible : ''}`}>
        <ul>
          {menuItems.map((option, index) => (
            <li key={option} className={index === selectedIndex ? styles.selected : ''}>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Screen;