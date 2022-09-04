import React, { useEffect, useState } from "react";
import play from "../styles/Play.module.css";
import Visualizer from "./Visualizer";
import { shuffle } from "./call";
import main from "../styles/Main.module.css";
import cancelGame from "../assets/cancelGame.svg";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

const SingleTrack = ({
  tracksImport,
  thisTrack,
  nextTrack,
  trackIndex,
  artistName,
}: {
  tracksImport: Object;
  thisTrack: TrackData;
  nextTrack: Function;
  trackIndex: number;
  artistName: string;
}) => {
  const router = useRouter();
  const { playID } = router.query;
  const [answerOptions, setAnswerOptions] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [correct, setCorrect] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showListenBtn, setShowListenBtn] = useState<boolean>(false);

  useEffect(() => {
    let tempAnswerOptions: string[] = [];
    const tracksLength = Object.keys(tracksImport).length - 1;
    let randomTrackIndexes: number[] = [];
    for (let i = 0; i < 3; i++) {
      let checkingForDuplicate: boolean = true;
      while (checkingForDuplicate) {
        const randomNum = Math.floor(Math.random() * tracksLength);
        checkingForDuplicate = randomTrackIndexes.includes(randomNum);
        if (Object.keys(tracksImport)[randomNum] === thisTrack.name)
          checkingForDuplicate = true;
        if (!checkingForDuplicate) {
          tempAnswerOptions.push(Object.keys(tracksImport)[randomNum]);
          randomTrackIndexes.push(randomNum);
        }
      }
    }
    tempAnswerOptions.push(thisTrack.name);
    const shuffledAnswerOptions = shuffle(tempAnswerOptions);
    setAnswerOptions(shuffledAnswerOptions);
    if (isMobile) setShowListenBtn(true);
    setLoading(false);
  }, [thisTrack]);

  const checkAnswer = (clickedAnswer: string) => {
    if (clickedAnswer === thisTrack.name) setCorrect(true);
    else setCorrect(false);
    setShowAnswer(true);
  };

  const resetTrack = () => {
    setLoading(true);
    setShowAnswer(false);
    const addToScore = correct ? 1 : 0;
    nextTrack(addToScore);
  };
  return (
    <>
      {!loading ? (
        <div className={play.playScreenContainer}>
          <div
            className={play.homeArrowContainer}
            onClick={() =>
              router.push(
                `/start/${encodeURIComponent("artists")}/${encodeURIComponent(
                  playID as string
                )}`
              )
            }
          >
            <img src={cancelGame.src}></img>
            <div className={play.displayNone}>Leave Game</div>
          </div>
          <div></div>
          <div></div>
          {showListenBtn ? (
            <div style={{ textAlign: "center", position: "absolute" }}>
              <h2 style={{ marginBottom: "10rem" }} className={main.header1}>
                {trackIndex + 1}/10
              </h2>
              <h1 className={main.header1}>{artistName}</h1>
            </div>
          ) : (
            <div>
              {!showAnswer ? (
                <div className={play.playContainer}>
                  {answerOptions.map((answer: string) => {
                    return (
                      <div
                        className={play.playBtn}
                        key={answer}
                        onClick={() => checkAnswer(answer)}
                      >
                        {answer}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={play.answerContainer}>
                  {correct ? (
                    <h1 className={play.answer}>Correct 🎉✅</h1>
                  ) : (
                    <h1 className={play.answer}>Wrong 💥❌</h1>
                  )}

                  <div className={play.playImgContainer}>
                    <img
                      className={play.thumbnailImg}
                      src={thisTrack.albumURL}
                      alt="alt"
                    />
                    <div className={main.pl}>
                      <div className={main.imgSubContainer}>
                        <div>{trackIndex + 1}/10</div>
                        <h1 className={main.header1}>{thisTrack.name}</h1>
                        <h3 className={main.header1}>
                          {thisTrack.artistNames[0]}
                        </h3>
                      </div>
                      <div className={main.btn} onClick={resetTrack}>
                        Continue
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={play.bottomContainer}>
            <Visualizer
              trackURL={thisTrack.publicURL}
              showAnswer={showAnswer}
              setShowListenBtn={setShowListenBtn}
              showListenBtn={showListenBtn}
            ></Visualizer>
          </div>
        </div>
      ) : (
        <div className={play.playStaticContainer}> </div>
      )}
    </>
  );
};

export default SingleTrack;
