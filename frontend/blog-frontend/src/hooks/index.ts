import { useEffect, useState } from "react";
import axios from "axios";
import serverUrl from "../config/server";

export const useBlogs = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState([]);

  // const token: string = localStorage.getItem("authToken");

  async function fetchBlogs() {
    const response = axios.get(`${serverUrl}/api/v1/blog/bulk`);
    const data = (await response).data;
    setBlogs(data);
    setLoading(true);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
  };
};
