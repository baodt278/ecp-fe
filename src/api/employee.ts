import axios from "axios";

const BASE_URL = "http://localhost:8080/api/employee";

interface ActionDto {
  code: string;
  text: string;
  status: string;
}

export const getRequestsForStaff = (acronym: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/staff/requests?acronym=" + acronym,
  });
};

export const reviewRequest = (acronym: string, data: ActionDto) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/staff/review-request?acronym=" + acronym,
        data: data,
    });
    
}

export const getRequestsNeedAccept = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/manager?acronym=" + acronym,
    });
}

export const acceptRequest = (acronym: string, data: ActionDto) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/manager/accept?acronym=" + acronym,
        data: data,
    });
}