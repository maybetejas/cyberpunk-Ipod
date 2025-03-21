import React, { useEffect, useRef } from 'react';

const Visualizer = ({ audioRef, currentSong }) => {
    const canvasRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();

            if (!sourceRef.current) {
                sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
                sourceRef.current.connect(analyser);
            }

            analyser.connect(audioContext.destination);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext('2d');

            const draw = () => {
                const WIDTH = canvas.width;
                const HEIGHT = canvas.height;

                requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                canvasContext.fillStyle = 'rgb(0, 0, 0)';
                canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

                const barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];

                    canvasContext.fillStyle = 'red'; // Set rectangle color to red
                    canvasContext.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 1;
                }
            };

            draw();

            return () => {
                analyser.disconnect();
            };
        }
    }, [audioRef, currentSong]);

    return <canvas ref={canvasRef} width={300} height={300} />;
};

export default Visualizer;