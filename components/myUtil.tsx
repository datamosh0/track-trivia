import React from "react";
import { useEffect, useState } from "react";
import {
  getTracksData,
  getPlaylistTracks,
  getTrackIds,
  wrapInRetry,
} from "./call";
import { supabase } from "../supabaseClient";

const MyUtil = () => {
  const playlistTracks = async () => {
    const artistsObj = {
      // "37i9dQZF1DX0XUsuxWHRQd": "RapCaviar",
      // "4riovLwMCrY3q0Cd4e0Sqp": "Rap Hits (2010-2022)",
      // "0C2zyPdlkbWHrwVg9gqNdU": "90s rap",
      "5yu0PWKz6u2MwuXXtUQUtZ": "2010 Rap Throwbacks",
      // "0i24Lg9bNOlIjGn9sikDNv": "2000's Hip Hop/Rap hits",
    };

    Object.entries(artistsObj).map(async ([artistID, artistName]) => {
      const { tracks: items } = await wrapInRetry(
        getPlaylistTracks,
        `${artistID}`
      );
      const hrefArr = Object.values(items.items).map((item: any) => {
        return item.track.href;
      });
      console.log(hrefArr);
      const newObj = {};
      Object.values(items.items).map((item: any) => {
        newObj[item.track.name] = item.track.id;
      });

      // for await (const [songName, songID] of Object.entries(newObj)) {
      //   const { data, error } = await supabase
      //     .from(`${artistID}`)
      //     .insert([{ songname: songName, songid: songID }]);
      // }
    });
  };

  useEffect(() => {
    playlistTracks();
  }, []);

  return <div>MyUtil</div>;
};
export default MyUtil;
