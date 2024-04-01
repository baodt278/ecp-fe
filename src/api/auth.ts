import { LoginBody, RegisterBody } from "@/schema/auth.schema";
import { z } from "zod";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const loginAdmin = (values: z.infer<typeof LoginBody>) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/admin-login",
    data: values,
  });
};

export const loginEmployee = (values: z.infer<typeof LoginBody>) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/employee-login",
    data: values,
  });
};

export const loginClient = (values: z.infer<typeof LoginBody>) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/client-login",
    data: values,
  });
};

export const registerClient = (values: z.infer<typeof RegisterBody>) => {
  return axios({
    method: "POST",
    url: BASE_URL + "/client-register",
    data: values,
  });
};
