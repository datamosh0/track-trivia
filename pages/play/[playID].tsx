import { useEffect, useState } from "react";
import play from "../../styles/play.module.css";
import { useRouter } from "next/router";
import SingleTrack from "../../components/SingleTrack";
import { useSelector } from "react-redux";
import { selectTrackData, selectTracksImport } from "../../app/trackData";
import nameId from "../../JSON/nameId.json";
import main from "../../styles/main.module.css";
import { supabase } from "../../supabaseClient";

const Play = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [thisTrack, setThisTrack] = useState<TrackData>();
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [artistName, setArtistName] = useState<string>("");
  const [thumbnailImg, setThumbnailImg] = useState<string>("");
  const [scoreArr, setScoreArr] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [scoreAvg, setScoreAvg] = useState<number>();
  const [playedTimes, setPlayedTimes] = useState<number>();
  const router = useRouter();
  const { playID } = router.query;
  const trackData = useSelector(selectTrackData);
  const tracksImport = useSelector(selectTracksImport);

  useEffect(() => {
    if (trackData !== undefined) {
      setThisTrack(trackData[trackIndex]);
      setLoading(false);
    } else {
      router.push(
        `/start/${encodeURIComponent("artists")}/${encodeURIComponent(
          "5K4W6rqBFWDnAN6FQUkS6x"
        )}`
      );
    }
  }, [trackData]);

  const nextTrack = (addToScore: number) => {
    scoreArr.push(addToScore);
    setScore(score + addToScore);
    if (trackData[trackIndex + 1] !== undefined) {
      setThisTrack(trackData[trackIndex + 1]);
      setTrackIndex(trackIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  useEffect(() => {
    let tempArtistName: string = "";
    const firstCall = async () => {
      Object.entries(nameId).forEach(([name, id]) => {
        if (id === playID) tempArtistName = name;
      });
      const tempThumbnailImg = await import(
        `../../assets/${tempArtistName}.jpg`
      );
      setArtistName(tempArtistName);
      setThumbnailImg(tempThumbnailImg.default.src);
      const { data } = await supabase.from(`${playID}`).select("score");
      const tempPlayedTimes = Object.entries(data).length;
      const tempScoreAvg =
        Object.entries(data)
          .map(([key, value]) => {
            return value.score;
          })
          .reduce((partialSum, a) => partialSum + a, 0) / tempPlayedTimes;

      setScoreAvg(tempScoreAvg);
      setPlayedTimes(tempPlayedTimes);
    };
    firstCall();
  }, []);
  useEffect(() => {
    if (showScore === true) {
      const sendScore = async () => {
        const res = await supabase.from(`${playID}`).insert([{ score: score }]);
      };
      sendScore();
    }
  }, [showScore]);

  return (
    <>
      {!loading ? (
        showScore ? (
          <div>
            <div className={play.endScreenStaticContainer}>
              <div className={play.playImgContainer}>
                <img
                  className={main.thumbnailImg}
                  src={thumbnailImg}
                  alt="alt"
                />
                <div className={main.pl}>
                  <div className={main.imgSubContainer}>
                    <h1 className={main.header1}>{artistName}</h1>
                    <h2 className={main.header1}>Your Score: {score}/10</h2>
                    <h3 className={main.header1} style={{ marginTop: "1rem" }}>
                      Avg Score: {scoreAvg}/10
                    </h3>
                    <h3 className={main.header1}>Played {playedTimes} times</h3>
                  </div>
                </div>
              </div>
              <div className={play.endBtnContainer}>
                <ul className={`${main.btn} ${main.mainUL}`}>
                  <li>
                    Share
                    <ul className={main.drop}>
                      <div>
                        <li>Twitter</li>
                        <li>Facebook</li>
                        <li>Instagram</li>
                      </div>
                    </ul>
                  </li>
                </ul>
                <div
                  className={main.btn}
                  onClick={() =>
                    router.push(
                      `/start/${encodeURIComponent(
                        "artists"
                      )}/${encodeURIComponent("5K4W6rqBFWDnAN6FQUkS6x")}`
                    )
                  }
                >
                  Replay
                </div>
                <div className={main.btn} onClick={() => router.push("/")}>
                  Home
                </div>
              </div>
              <div className={play.trackContainer}>
                {trackData.map((track: TrackData, index: number) => {
                  let correct = false;
                  if (scoreArr[index]) correct = true;
                  return (
                    <div className={play.endTrackContainer}>
                      <h3 className={main.header1}>{track.name}</h3>
                      <h4 className={`${play.trackSubContainer}`}>
                        <a
                          target="_blank"
                          href={track.spotify}
                          className={play.spotifyLink}
                        >
                          Listen on Spotify
                        </a>
                        <div>{correct ? <div>✅</div> : <div>❌</div>}</div>
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
            <div></div>
          </div>
        ) : (
          <SingleTrack
            thisTrack={thisTrack}
            tracksImport={tracksImport!}
            nextTrack={nextTrack}
            trackIndex={trackIndex}
          ></SingleTrack>
        )
      ) : (
        <div className={play.playStaticContainer}></div>
      )}
    </>
  );
};

export default Play;
