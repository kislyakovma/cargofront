const host = process.env.NODE_ENV === "production"
  ? "https://push-notification-demo-server.herokuapp.com"
  : "http://localhost:4000";

function post(path, body) {
  return fetch(`${host}${path}`, {
    credentials: "omit",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "sec-fetch-mode": "cors",
    },
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => data);
}

function get(path) {
  return fetch(`${host}${path}`, {
    credentials: "omit",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "sec-fetch-mode": "cors",
    },
    method: "GET",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => data);
}

const http = {
  post,
  get,
};

export default http;
