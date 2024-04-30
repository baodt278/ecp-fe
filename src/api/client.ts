import {RequestCreate, RequestUpdate} from "@/schema/request.schema";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/client";

interface PasswordRequest {
    oldPassword: string;
    newPassword: string;
    renewPassword: string;
}

export const changePassword = (username: string, data: PasswordRequest) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/change-password?username=" + username,
        data: data,
    });
}

export const getContracts = (username: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/contracts?username=" + username,
    });
};

export const getPredictCurrentMonth = (contractName: string, date: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/records/predict-current?contractName=" + contractName + "&date=" + date,
    });
};

export const getRecordsCurrentMonth = (contractName: string, date: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/records/current-month?contractName=" + contractName + "&date=" + date,
    });
};

export const getRecords7DaysBefore = (contractName: string, date: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/records/7days-before?contractName=" + contractName + "&date=" + date,
    });
};

export const getTotals6MonthsBefore = (contractName: string, date: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/records/6months-before?contractName=" + contractName + "&date=" + date,
    });
};

export const getRequests = (username: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/requests?username=" + username,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const createRequest = (username: string, data: RequestCreate) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/create-request?username=" + username,
        data: data,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

}

export const updateRequest = (username: string, data: RequestUpdate) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/update-request?username=" + username,
        data: data,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteRequest = (username: string, code: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/delete-request?username=" + username + "&code=" + code,
    });
};


export const verifyAccount = (username: string, file: File[]) => {
    let formData = new FormData();
    for (let i = 0; i < file.length; i++) {
        const file1 = file[i];
        formData.append(`files[${i}]`, file1);
    }
    console.log(formData);
    return axios({
        method: "POST",
        url: BASE_URL + "/verify-account?username=" + username,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const requestVerify = (username: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/request-verify?username=" + username,
    });
};

export const getBillsContract = (contractName: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/bills?contractName=" + contractName,
    });
};

export const getBillCurrentMonth = (username: string, date: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/bills/current-month?username=" + username + "&date=" + date,
    });
};

export const getCompanies = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/companies",
    });
}

export const getInfo = (username: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/info?username=" + username,
    });
}

export const getInfoDetail = (username: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/info-detail?username=" + username,
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

export const getSystemNews = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/news/system",
    });
}

export const getLocalNews = (username: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/news/local?username=" + username,
    });
}