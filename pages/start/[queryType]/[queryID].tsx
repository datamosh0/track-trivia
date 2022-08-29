import React, { useState } from "react";
import { useRouter } from "next/router";
import { getTracksData, wrapInRetry } from "../../call";
import { useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import main from "../../../styles/Main.module.css";
import nameId from "../../../JSON/nameId.json";
import { useDispatch } from "react-redux";
import { setTrackData, setTracksImport } from "../../../app/trackData";
import leftArrow from "../../../assets/leftArrow.svg";
import play from "../../../styles/Play.module.css";

const QueryID = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { queryID } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [artistName, setArtistName] = useState<string>("");
  const [localTracksImport, setLocalTracksImport] = useState<string>("");
  const [thumbnailImg, setThumbnailImg] = useState<string>("");
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [timeouts, setTimeouts] = useState<any>();
  const callArtist = async (tempTracksImport: any) => {
    //Generate 10 Random Track Urls
    let quizLength = 10;
    const tracksLength = Object.keys(tempTracksImport).length - 1;
    let randomTrackIndexes: number[] = [];
    let tempTrackData: any = [];
    if (quizLength > tracksLength) quizLength = tracksLength;
    for (let i = 0; i < quizLength; i++) {
      let checkingForDuplicate: boolean = true;
      while (checkingForDuplicate) {
        const randomNum = Math.floor(Math.random() * tracksLength);
        checkingForDuplicate = randomTrackIndexes.includes(randomNum);
        if (!checkingForDuplicate) {
          randomTrackIndexes.push(randomNum);
          const thisTrack = Object.entries(tempTracksImport)[randomNum];
          const supabaseID =
            queryID + "/" + thisTrack[0].replace(/ /g, "_") + ".mp3";
          const { publicURL } = supabase.storage
            .from("audio")
            .getPublicUrl(supabaseID);
          const {
            album: { name: albumName },
            album: images,
            external_urls: { spotify },
            name,
            artists,
          } = await wrapInRetry(getTracksData, thisTrack[1] as string);
          const albumURL = images.images[1].url;
          const artistNames = artists.map((artist: any) => {
            return artist.name;
          });
          tempTrackData.push({
            spotify,
            name,
            albumName,
            albumURL,
            artistNames,
            publicURL,
          });
        }
      }
    }
    dispatch(setTracksImport(tempTracksImport));
    dispatch(setTrackData(tempTrackData));
  };

  useEffect(() => {
    if (router.isReady) {
      const firstCall = async () => {
        let tempArtistName: string;
        Object.entries(nameId).forEach(([name, id]) => {
          if (id === queryID) tempArtistName = name;
        });
        const tempTracksImport = await import(
          `../../../JSON/trackIDtoName/${queryID}.json`
        );
        const tempThumbnailImg = await import(
          `../../../assets/thumbnails/${queryID}.jpg`
        );

        setThumbnailImg(tempThumbnailImg.default.src);
        setArtistName(tempArtistName);
        setLocalTracksImport(tempTracksImport);
        setLoading(false);
        callArtist(tempTracksImport);
      };
      firstCall();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (showCountdown) {
      let tempTimeouts = [];
      for (let i = 0; i < 4; i++) {
        let thisTimeout = setTimeout(() => {
          if (i < 3) setCountdownValue(countdownValue - i);
          else router.push(`/play/${encodeURIComponent(queryID as string)}`);
        }, i * 1000);
        tempTimeouts.push(thisTimeout);
      }
      setTimeouts(tempTimeouts);
    } else if (timeouts !== undefined && !showCountdown) {
      {
        for (var i = 0; i < 4; i++) {
          clearTimeout(timeouts[i]);
        }
        setCountdownValue(3);
      }
    }
  }, [showCountdown]);

  return (
    <div className={main.staticContainer}>
      <div className={play.homeArrowContainer} onClick={() => router.push("/")}>
        <img src={leftArrow.src}></img>
        <div className={play.displayNone}>Go Home</div>
      </div>
      {!loading && (
        <div className={main.startCard}>
          <div className={main.imgContainer}>
            <img className={main.thumbnailImg} src={thumbnailImg} alt="alt" />
            <div className={main.pl}>
              <div className={main.imgSubContainer}>
                <h1 className={main.header1}>{artistName}</h1>
                <h3 className={main.header1}>10 Questions</h3>
              </div>
              <div>
                {Object.entries(localTracksImport).length} Tracks To Guess From
              </div>
            </div>
          </div>
          <div className={main.btnContainer}>
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
            {showCountdown ? (
              <div className={main.btn} onClick={() => setShowCountdown(false)}>
                Stop
              </div>
            ) : (
              <div className={main.btn} onClick={() => setShowCountdown(true)}>
                Play
              </div>
            )}
          </div>
          {showCountdown && <h1>Start In: {countdownValue}</h1>}
        </div>
      )}
    </div>
  );
};

export default QueryID;
