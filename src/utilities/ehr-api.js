import sendRequest from "./sendRequest";

const baseURL = "/ehr/";

export async function getEHR() {
  return sendRequest(baseURL);
}

export async function getNotes() {
  return sendRequest(`${baseURL}notes/`);
}

export async function createNote(formData) {
  return sendRequest(`${baseURL}notes/`, "POST", formData);
}

export async function updateNote(formData, id) {
  return sendRequest(`${baseURL}notes/${id}/`, "PUT", formData);
}

export async function deleteNote(id) {
  return sendRequest(`${baseURL}notes/${id}/`, "DELETE");
}

