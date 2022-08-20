import axios from "axios";
import qs from "qs";
import { setToken } from "../app/token";
import store from "../app/store";

export const getAccessToken = async () => {
  var clientSecret = "7b2b980cca9e4c21b5b578721ecc2a91";
  var clientId = "4894bbad8a0540dc9bd6689f06cc94bc";
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

export const getTrackIds = async (songName, token) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      // token stored as global variable
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axios.get(
      `https://api.spotify.com/v1/search?q=track:${songName}+artist:Kanye&type=track`,
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
