import sendRequest from "./sendRequest";

const baseURL = "/reviews/";

export async function index() {
  return sendRequest(baseURL);
}

export async function create(formData) {
  return sendRequest(baseURL, "POST", formData);
}

export async function detail(id) {
  return sendRequest(`${baseURL}${id}/`);
}

export async function update(formData, id) {
  return sendRequest(`${baseURL}${id}/`, "PUT", formData);
}

export async function deleteReview(id) {
  return sendRequest(`${baseURL}${id}/`, "DELETE");
}

