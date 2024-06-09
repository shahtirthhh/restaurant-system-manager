import { useState, useEffect } from "react";

export function useFetch(url, method = "GET", body = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var config = {};
  if (method === "GET") {
    config.method = "GET";
  } else {
    // eslint-disable-next-line no-unused-expressions
    config.headers = {
      "Content-Type": "application/json",
    };
    config.method = method;
    config.body = JSON.stringify(body);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, { ...config });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to abort fetch request if component unmounts
    return () => {
      // Cleanup logic if needed
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { data, loading, error };
}
export default useFetch;
