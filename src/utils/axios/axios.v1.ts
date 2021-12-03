import axios from "axios";

const HOST = process.env.ALPACAL_URL || "https://paper-api.alpaca.markets/v2";
const axiosInstance = axios.create({
	baseURL: `${HOST}`,
});

export default axiosInstance;
