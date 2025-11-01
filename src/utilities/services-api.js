import sendRequest from "./sendRequest";

const baseURL = "/services/";

export async function index() {
  return sendRequest(baseURL);
}

export async function detail(id) {
  return sendRequest(`${baseURL}${id}/`);
}


