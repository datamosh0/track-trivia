import { useRef, useEffect, useState } from "react";
import play from "../stlyes/Play.module.css";
const Visualizer = ({ trackURL, showAnswer }) => {
  const canvasRef = useRef();
  const audioRef = useRef();
  const [localContext, setLocalContext] = useState<any>();
  const [localSource, setLocalSource] = useState<any>();
  const [localTimeout, setLocalTimeout] = useState<any>();
  const [localAudio, setLocalAudio] = useState<any>();
  const loadVisual = () => {
    if (window !== undefined) {
      var canvas: any = canvasRef.current;
      var audio: any = audioRef.current;
      audio.src = `${trackURL}`;
      audio.load();
      audio.crossOrigin = "anonymous";
      var context;
      var src;
      if (localContext === undefined) {
        context = new AudioContext();
        src = context.createMediaElementSource(audio);
      } else {
        context = localContext;
        src = localSource;
      }

      var analyser = context.createAnalyser();

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight / 2.5;
      var ctx = canvas.getContext("2d");

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 256;

      var bufferLength = analyser.frequencyBinCount;

      var dataArray = new Uint8Array(bufferLength);

      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          var r = barHeight + 25 * (i / bufferLength);
          var g = 250 * (i / bufferLength);
          var b = 50;

          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      audio.play();
      let myTimeout = setTimeout(() => {
        audio.pause();
      }, 10000);
      renderFrame();

      setLocalAudio(audio);
      setLocalTimeout(myTimeout);
      setLocalSource(src);
      setLocalContext(context);
    }
  };

  useEffect(() => {
    if (showAnswer === true) {
      if (localAudio.paused) {
        localAudio.currentTime = 10;
        localAudio.play();
      } else {
        clearTimeout(localTimeout);
      }
    }
  }, [showAnswer]);

  useEffect(() => {
    loadVisual();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <audio ref={audioRef}></audio>
    </div>
  );
};

export default Visualizer;
