import z from "zod";

export interface RequestUpdate {
  code: string;
  description: string;
  info: string;
  image: File[];
}

export interface RequestCreate {
  type: string;
  description: string;
  image: File[];
  info: string;
  acronymCompany: string;
}
