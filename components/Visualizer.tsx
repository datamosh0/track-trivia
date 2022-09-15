import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";
import { selectVolume } from "../app/trackData";
import { setVolume } from "../app/trackData";
import play from "../styles/Play.module.css";
const Visualizer = ({
  trackURL,
  showAnswer,
  setShowListenBtn,
  showListenBtn,
}: {
  trackURL: string;
  showAnswer: boolean;
  setShowListenBtn: Dispatch<SetStateAction<boolean>>;
  showListenBtn: boolean;
}) => {
  const windowVolume = useSelector(selectVolume);
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>();
  const audioRef = useRef<HTMLAudioElement>();
  const volumeRef = useRef<HTMLInputElement>();
  const [localContext, setLocalContext] = useState<AudioContext>();
  const [localSource, setLocalSource] = useState<MediaElementAudioSourceNode>();
  const [localTimeout, setLocalTimeout] = useState<NodeJS.Timeout>();
  const [localAudio, setLocalAudio] = useState<HTMLAudioElement>();
  const [localVolume, setLocalVolume] = useState<number>(windowVolume);
  const [showResetButton, setShowResetButton] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);

  const loadVisual = () => {
    if (window !== undefined) {
      var canvas = canvasRef.current;
      var audio = audioRef.current;
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
        context.resume();
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
      setLoading(false);
      setShowListenBtn(false);
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
    if (!isMobile) loadVisual();
  }, []);

  const changeVolume = () => {
    const newVolume = parseFloat(volumeRef.current.value);

    audioRef.current.volume = newVolume;
    dispatch(setVolume(newVolume));
    setLocalVolume(newVolume);
  };

  return (
    <div>
      <div>
        {showListenBtn && (
          <div className={play.listenBtn}>
            <div className={play.playBtn} onClick={loadVisual}>
              listen
            </div>
          </div>
        )}
        <div>
          {!loading && (
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
              {!isMobile && (
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
              )}
            </div>
          )}
          <canvas ref={canvasRef}></canvas>
          <audio ref={audioRef}></audio>
        </div>
        {!loading && (
          <div>
            <div className={play.bar}>
              <div className={play.in}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
