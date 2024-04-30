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
export const getEmployees = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/employees?acronym=" + acronym,
    });
};

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

export const deleteCompany = (acronym: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/delete-company?acronym=" + acronym,
    });
}

export const updateCompany = (data: CompanyDto) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/update-company",
        data: data,
    });
}

export const getContracts = (acronym: string) => {
    return axios({
        method: "GET",
        url: BASE_URL + "/contracts?acronym=" + acronym,
    });
}

export const getBase = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/bases",
    });
}

export const createBase = (data: any) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/create-base",
        data: data,
    });
}

export const updateBase = (data: any) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/update-base",
        data: data,
    });
}

export const deleteBase = (object: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/delete-base?object=" + object,
    });
}

export const getPrices = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/prices",
    });
}

export const updatePrice = (id: number, value: number) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/update-price?id=" + id + "&value=" + value,
    });
}

export const deletePrice = (id: number) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/delete-price?id=" + id,
    });
}

export const getSystemNews = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/news/system",
    });
}

export const getLocalNews = () => {
    return axios({
        method: "GET",
        url: BASE_URL + "/news/local",
    });
}

export const createNews = (data: any) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/news/create-global",
        data: data,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteNews = (code: string) => {
    return axios({
        method: "POST",
        url: BASE_URL + "/news/delete?code=" + code,
    });
}