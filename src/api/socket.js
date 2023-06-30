import io from "socket.io-client"

const SERVER_ENDPOINT = "";

export const socket = io(SERVER_ENDPOINT).on("connection");