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

export const reviewRequest = (username: string, data: ActionDto) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/staff/review-request?username=" + username,
    data: data,
  });
};

export const getRequestsNeedAccept = (acronym: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/manager/requests?acronym=" + acronym,
  });
};

export const acceptRequest = (username: string, data: ActionDto) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/manager/accept-request?username=" + username,
    data: data,
  });
};

export const getInfo = (username: string) => {
  return axios({
    method: "GET",
    url: BASE_URL + "/info?username=" + username,
  });
}

export const updateInfo = (username: string, data: any) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/update-info?username=" + username,
    data: data,
  });
}

export const uploadAvatar = (username: string, file: File[]) => {
  let formData = new FormData();
  for (let i = 0; i < file.length; i++) {
    const file1 = file[i];
    console.log(file1);
    formData.append(`files[${i}]`, file1);
  }
  console.log(formData);
  return axios({
    method: "POST",
    url: BASE_URL + "/upload-avatar?username=" + username,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const changePassword = (username: string, data: any) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/change-password?username=" + username,
    data: data,
  });
}

export const getCompany = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/company?acronym=" + acronym,
    });
}

export const getEmployees = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/employees?acronym=" + acronym,
    });
}

export const getContracts = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/contracts?acronym=" + acronym,
    });
}

export const createEmployee = (
    username: string,
    acronym: string,
    data: any
) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/create-employee?acronym=" + acronym + "&username=" + username,
    data: data,
  });
};

export const deleteEmployee = (username:string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/delete-employee?username=" + username,
    });
}

export const getAnalystData = (acronym: string, date: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/manager/analyst?acronym=" + acronym + "&date=" + date,
    });
}

export const getRequestGeneral = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/request?acronym=" + acronym,
    });
}

export const getSystemNews = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/news/global",
    });
}

export const getLocalNews = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/news/local?acronym=" + acronym,
    });
}

export const createNews = (acronym: string, data: any) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/news/create-local?acronym=" + acronym,
        data: data,
    });
}

export const deleteNews = (code: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/news/delete?code=" + code,
    });
}

export const createBill = (contractName: string, date: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/staff/bill-create?contractName=" + contractName + "&date=" + date,
    });
}

export const payBill = (contractName: string, date: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/staff/bill-pay?contractName=" + contractName + "&date=" + date,
    });
}

export const getContractInfo = (contractName: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/staff/get-contract?contractName=" + contractName,
    });
}

export const createRecord = (contractName: string, date: string, data: any) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/staff/create-record?contractName=" + contractName + "&date=" + date,
        data: data,
    });
};