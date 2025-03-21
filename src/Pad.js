import styles from './Pad.module.css';

const Pad = ({ onMenuClick, scrollWheelRef, handleSelect, songIndex, handleMusic, currentSong, audioRef }) => {

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    };

    return (
        <div className={styles.pad}>
            <div className={styles.outerPad} ref={scrollWheelRef}>
                <button className={`${styles.button} ${styles.top} ${styles.menuButton}`} onClick={onMenuClick}>MENU</button>
                <button onClick={() => handleMusic(true)} className={`${styles.button} ${styles.right}`}>&gt;&gt;</button>
                <button onClick={handlePlayPause} className={`${styles.button} ${styles.bottom}`}>||</button>
                <button onClick={() => handleMusic(false)} className={`${styles.button} ${styles.left}`}>&lt;&lt;</button>
                <div className={styles.innerPad} onClick={handleSelect}></div>
            </div>
        </div>
    );
};

export default Pad;