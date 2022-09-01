import { useEffect, useState } from "react";
import play from "../../../styles/Play.module.css";
import { useRouter } from "next/router";
import SingleTrack from "../../../components/SingleTrack";
import { useSelector } from "react-redux";
import { selectTrackData, selectTracksImport } from "../../../app/trackData";
import nameId from "../../../JSON/nameId.json";
import main from "../../../styles/Main.module.css";
import { supabase } from "../../../supabaseClient";
import { NextPage } from "next";
import QueryID from "../../start/[queryType]/[QueryID]";

const Play: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [thisTrack, setThisTrack] = useState<TrackData>();
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [artistName, setArtistName] = useState<string>("");
  const [thumbnailImg, setThumbnailImg] = useState<string>("");
  const [scoreArr, setScoreArr] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [scoreAvg, setScoreAvg] = useState<number | string>();
  const [playedTimes, setPlayedTimes] = useState<number>();
  const router = useRouter();
  const { playID, queryType } = router.query;
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
        `../../../assets/thumbnails/${playID}.jpg`
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
      const returnAvg = tempScoreAvg ? tempScoreAvg : "?";
      setScoreAvg(returnAvg);
      setPlayedTimes(tempPlayedTimes);
    };
    firstCall();
  }, []);
  useEffect(() => {
    if (showScore === true) {
      const sendScore = async () => {
        const res = await supabase.from(`${playID}`).insert([{ score: score }]);
        console.log(res);
      };
      sendScore();
    }
  }, [showScore]);

  return (
    <div className={play.playStaticContainer}>
      {!loading ? (
        !showScore ? (
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
                        <li>
                          <a
                            className="twitter-share-button"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://twitter.com/intent/tweet?text=${artistName}%20Track%20Trivia!%20Test%20Your%20Music%20Knowledge%20at%20https://track-trivia.vercel.app/start/${queryType}/${playID}`}
                            data-size="large"
                          >
                            Twitter
                          </a>
                        </li>
                        <li
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `https://track-trivia.vercel.app/start/${queryType}/${playID}`
                            )
                          }
                        >
                          Copy Link
                        </li>
                        {/* <li>Facebook</li>
                        <li>Instagram</li> */}
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
                      )}/${encodeURIComponent(`${playID}`)}`
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
                  let correct = scoreArr[index] ? true : false;
                  return (
                    <div className={play.endTrackContainer} key={track.name}>
                      <h3 className={main.header1}>{track.name}</h3>
                      <h4 className={`${play.trackSubContainer}`}>
                        <a
                          target="_blank"
                          rel="noreferrer"
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
    </div>
  );
};

export default Play;
