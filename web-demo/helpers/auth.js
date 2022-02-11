import Cookies from './../node_modules/js-cookie/dist/js.cookie';
import axios from "axios";

export const setToken = token => Cookies.set("oToken", token, { expires: 7 });
export const isLoggedIn = () => Cookies.get("oToken");

export const authUser = async () => {
  try {
    const { data } = await axios.get('http://api-demo.test/api/authUser',axiosConfig);
    return data.user;
	} catch (err) {
		console.log('Err',err)
	}
};

export const logout = async callback => {
	setToken("");
	window.location.href = "/loader";
};

export const axiosConfig = {
  headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
			'Accept' : 'application/json',
			'Authorization': 'Bearer ' + isLoggedIn()
  }
};

export const axiosConfigLogin = {
  headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
			'Accept' : 'application/json',
  }
};