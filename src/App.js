import { useState, useRef, useEffect } from 'react';
import { preventTextSelection, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseStart, handleMouseMove, handleMouseEnd } from './utils.js';
import styles from './App.module.css';
import Screen from './Screen';
import Pad from './Pad';
import songs from './songs';

const menuItems = ['HOME', 'COVERFLOW', 'MUSIC', 'GAME', 'SETTINGS'];

function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const scrollWheelRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startAngleRef = useRef(0);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [songIndex, setSongIndex] = useState(0);


  const audioRef = useRef(null);

  useEffect(()=>{

    if (scrollWheelRef.current) {
      scrollWheelRef.current.addEventListener('touchstart', (e) => handleTouchStart(e, isDraggingRef, scrollWheelRef, startAngleRef));
      window.addEventListener('touchmove', (e) => handleTouchMove(e, isDraggingRef, scrollWheelRef, startAngleRef, selectedIndex, setSelectedIndex, menuItems));
      window.addEventListener('touchend', () => handleTouchEnd(isDraggingRef));
      scrollWheelRef.current.addEventListener('mousedown', (e) => handleMouseStart(e, isDraggingRef, scrollWheelRef, startAngleRef));
      window.addEventListener('mousemove', (e) => handleMouseMove(e, isDraggingRef, scrollWheelRef, startAngleRef, selectedIndex, setSelectedIndex, menuItems));
      window.addEventListener('mouseup', () => handleMouseEnd(isDraggingRef));
      window.addEventListener('mouseleave', () => handleMouseEnd(isDraggingRef));
      window.addEventListener('selectstart', preventTextSelection);
    }

    return () => {
      if (scrollWheelRef.current) {
        scrollWheelRef.current.removeEventListener('touchstart', (e) => handleTouchStart(e, isDraggingRef, scrollWheelRef, startAngleRef));
        window.removeEventListener('touchmove', (e) => handleTouchMove(e, isDraggingRef, scrollWheelRef, startAngleRef, selectedIndex, setSelectedIndex, menuItems));
        window.removeEventListener('touchend', () => handleTouchEnd(isDraggingRef));
        scrollWheelRef.current.removeEventListener('mousedown', (e) => handleMouseStart(e, isDraggingRef, scrollWheelRef, startAngleRef));
        window.removeEventListener('mousemove', (e) => handleMouseMove(e, isDraggingRef, scrollWheelRef, startAngleRef, selectedIndex, setSelectedIndex, menuItems));
        window.removeEventListener('mouseup', () => handleMouseEnd(isDraggingRef));
        window.removeEventListener('mouseleave', () => handleMouseEnd(isDraggingRef));
        window.removeEventListener('selectstart', preventTextSelection);
      }
    };

  }, [selectedIndex, menuItems])

  
  const handleSelect = () => {
    setSelectedItem(menuItems[selectedIndex]);
    setMenuVisible(false)
  };

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  }

  const handleMusic = (move) => {
    setSongIndex((prevIndex) => {
        let newIndex;
        if (move) {
            newIndex = (prevIndex + 1) % songs.length;
        } else {
            newIndex = prevIndex === 0 ? songs.length - 1 : prevIndex - 1;
        }
        setCurrentSong(songs[newIndex]);
        return newIndex;
    })

    
};

  return (
    <main className={styles.main}>
    
  


      <div className={styles.iPod}>
        <Screen menuVisible={menuVisible} 
        menuItems={menuItems} 
        selectedIndex={selectedIndex} 
        setMenuVisible={setMenuVisible}
        currentSong={currentSong}
        selectedItem={selectedItem}
        songIndex={songIndex}
        audioRef={audioRef}
           />
        <Pad 
            onMenuClick={toggleMenu} 
            scrollWheelRef={scrollWheelRef} 
            handleSelect={handleSelect} 
            currentSong={currentSong}
            songIndex={songIndex}
            handleMusic={handleMusic}
            audioRef={audioRef}  

            />
      </div>
    </main>
  );
}

export default App;


