import React from "react";
import { useEffect } from "react";
import {
  getTracksData,
  getPlaylistTracks,
  getTrackIds,
  wrapInRetry,
} from "./call";
import { supabase } from "../supabaseClient";

const MyUtil = () => {
  const artistsObj = {
    "1dBC3Mxf8j9DINMUu8yKqx": "Kendrick Lamar",
  };
  let spotifyLinks = {};

  const playlistTracks = async () => {
    Object.entries(artistsObj).map(async ([artistID, artistName]) => {
      let thisSpotifyLinks = [];

      const { items } = await wrapInRetry(getPlaylistTracks, `${artistID}`);
      const playlistTrackNames = items.map((song: any) => {
        return song.track.name;
      });
      playlistTrackNames.forEach(async (songName) => {
        let tempSongName = songName.replace(/ /g, "&");

        const res = await wrapInRetry(getTrackIds, {
          songName: tempSongName,
          artistName: artistName,
        });
        if (res === 0) return;
        const possibleSongs = res.tracks.items;
        let theSong;
        for (const item of possibleSongs) {
          const artistsNames = item.artists.map((artist) => {
            return artist.name;
          });

          if (artistsNames.includes(`${artistName}`)) {
            theSong = item;
            break;
          }
        }

        if (theSong)
          thisSpotifyLinks.push(
            `https://open.spotify.com/track/${theSong.uri.split(":")[2]}`
          );
      });
      spotifyLinks[artistID] = thisSpotifyLinks;
    });
    console.log(spotifyLinks);
  };

  const makeJson = async () => {
    const newObj = {};
    const artistName = "Kendrick Lamar";
    const { data } = await supabase.storage
      .from("audio")
      .list("2YZyLoL8N0Wb9xBt1NhZWg");
    console.log(data.length);
    const trackNames = Object.values(data).map((song: any) => {
      return song.name.replace(/_/g, " ").replace(".mp3", "");
    });
    trackNames.forEach(async (songName) => {
      let tempSongName = songName.replace(/ /g, "&");

      const res = await wrapInRetry(getTrackIds, {
        songName: tempSongName,
        artistName: artistName,
      });
      if (res === 0) return;
      const possibleSongs = res.tracks.items;
      let theSong;
      for (const item of possibleSongs) {
        const artistsNames = item.artists.map((artist) => {
          return artist.name;
        });

        if (artistsNames.includes(`${artistName}`)) {
          theSong = item;
          break;
        }
      }
      if (theSong) newObj[songName] = theSong.uri.split(":")[2];
    });
    console.log(newObj);
  };

  useEffect(() => {
    // playlistTracks();
    // makeJson();
  }, []);

  return <div>MyUtil</div>;
};
export default MyUtil;
