import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectVolume } from "../app/trackData";
import { setVolume } from "../app/trackData";
import play from "../styles/Play.module.css";
const Visualizer = ({ trackURL, showAnswer }) => {
  const windowVolume = useSelector(selectVolume);
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const audioRef = useRef<any>();
  const volumeRef = useRef<any>();
  const [localContext, setLocalContext] = useState<any>();
  const [localSource, setLocalSource] = useState<any>();
  const [localTimeout, setLocalTimeout] = useState<any>();
  const [localAudio, setLocalAudio] = useState<any>();
  const [localVolume, setLocalVolume] = useState<number>(windowVolume);
  const [showResetButton, setShowResetButton] = useState<boolean>();
  const [suspended, setSuspended] = useState<boolean>(false);
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
      if (context.state === "suspended") {
        setSuspended(true);
        return;
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
      audioRef.current.volume = localVolume;
      audio.play();
      renderFrame();
      let myTimeout = setTimeout(() => {
        audio.pause();
        setShowResetButton(true);
      }, 10000);
      setTimeout(() => {
        setLocalAudio(audio);
        setLocalTimeout(myTimeout);
        setLocalSource(src);
        setLocalContext(context);
      }, 50);
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

  const changeVolume = () => {
    const newVolume = volumeRef!.current.value as number;
    audioRef.current.volume = newVolume;
    dispatch(setVolume(newVolume));
    setLocalVolume(newVolume);
  };

  return (
    <div>
      {suspended ? (
        <div onClick={loadVisual} className={play.playBtn}>
          listen
        </div>
      ) : (
        <div>
          <div>
            {showResetButton && (
              <div
                style={{
                  marginTop: "1rem",
                  marginLeft: "7%",
                  position: "absolute",
                }}
              >
                <div
                  className={play.playBtn}
                  style={{
                    width: "100px",
                    height: "50px",
                    fontSize: ".8rem",
                  }}
                  onClick={loadVisual}
                >
                  listen again
                </div>
              </div>
            )}
            <div className={play.volumeInputContainer}>
              <input
                type="range"
                id="volume"
                min=".02"
                max="1"
                step=".01"
                value={localVolume}
                ref={volumeRef}
                onChange={changeVolume}
                className={play.volumeInput}
              ></input>
            </div>
            <canvas ref={canvasRef}></canvas>
            <audio ref={audioRef}></audio>
          </div>
          <div className={play.bar}>
            <div className={play.in}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer;
