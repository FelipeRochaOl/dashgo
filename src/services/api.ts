import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.NEXT_PUBLIC_URL}/api`
    : `${process.env.NEXT_PUBLIC_URL}/.netlify/functions`;

export const api = axios.create({
  baseURL,
});
