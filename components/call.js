import axios from "axios";
import qs from "qs";
import { setToken } from "../app/token";
import store from "../app/store";
import { supabase } from "../supabaseClient";

export const getAccessToken = async () => {
  var clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  var clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  };
  const data = {
    grant_type: "client_credentials",
  };
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    );
    store.dispatch(setToken(response.data.access_token));
    return response.data.access_token;
  } catch (err) {
    console.log(err);
  }
};

export const getTrackIds = async ({ songName, artistName }, token) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      // token stored as global variable
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axios.get(
      `https://api.spotify.com/v1/search?q=track:${songName}+artist:${artistName}&type=track`,
      { headers }
    );
    if (data === undefined) return;
    return data;
  } catch (err) {
    return err.response.status;
  }
};

export const getPlaylistTracks = async (playlistID, token) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      // token stored as global variable
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistID}?limit:20`,
      { headers }
    );
    return data;
  } catch (err) {
    return err.response.status;
  }
};

export const getTracksData = async (trackID, token) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      // token stored as global variable
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackID}`,
      { headers }
    );
    return data;
  } catch (err) {
    return err.response.status;
  }
};

export const wrapInRetry = async (apiCallFunc, value) => {
  const token = store.getState().token.value;
  const response = await apiCallFunc(value, token);
  if (response === 401) {
    try {
      // store new token in application memory via global variable
      const newToken = await getAccessToken();
      const response = await apiCallFunc(value, newToken);
      return response;
    } catch (innerErr) {
      console.log(innerErr);
    }
  } else {
    return response;
  }
};
export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

//did not work

// export const makeTempTrackImports = async (artistName, queryID) => {
//   const { data } = await supabase.storage.from("audio").list(queryID);
//   const trackNames = Object.values(data).map((song) => {
//     return song.name.replace(/_/g, " ").replace(".mp3", "");
//   });
//   let newObj = {};
//   let results = [];
//   for await (const songName of trackNames) {
//     let tempSongName = songName.replace(/ /g, "&");

//     const res = await wrapInRetry(getTrackIds, {
//       songName: tempSongName,
//       artistName: artistName,
//     });
//     if (res === 0 || res === undefined) return;
//     results.push(res.tracks.items);
//   }
//   return results;
// };

// [QueryID].tsx:
// let tempTracksImport;
// try {
//   await Promise.resolve(
//     makeTempTrackImports(artistName, QueryID).then((tempTracks) => {
//       const newSongs = [];
//       console.log(tempTracks);
//       tempTracks.forEach((possibleSongs) => {
//         for (const song of possibleSongs) {
//           const includesArtist = song.artists
//             .map((artist) => {
//               return artist.name;
//             })
//             .includes(`${artistName}`);
//           console.log(includesArtist);
//           if (includesArtist) {
//             console.log(song);
//             newSongs.push(song);
//             break;
//           }
//         }
//       });
//       console.log(newSongs);
//     })
//   );
// } catch (e) {
//   console.log(e);
// }
