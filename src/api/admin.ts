import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";


interface ActionDto {
  code: string;
  text: string;
  status: string;
}

interface CompanyDto {
    name: string;
    acronym: string;
    address: string;
}

export const getCompanies = () => {
  return axios({
    method: "GET",
    url: BASE_URL + "/companies",
  });
};

export const createCompany = (data: CompanyDto) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/create-company",
    data: data,
  });
};

export const requestVerify = () => {
  return axios({
    method: "GET",
    url: BASE_URL + "/requests",
  });
};

export const verifyClient = (username: string, data: ActionDto) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/verify-client?username=" + username,
        data: data,
    });
};
