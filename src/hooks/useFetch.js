import { useQuery } from "react-query";
import axiosInstance from "../config/api";
import { useEffect } from "react";

/**
 * Custom hook for fetching data using React Query.
 *
 * @function useFetch
 * @param {string} url - The URL to fetch data from.
 * @param {Array} dependencies - The dependencies to trigger the fetch on changes.
 * @param {Object} params - The query parameters for the request.
 * @returns {Object} An object containing loading and fetched data information.
 */
export const useFetch = (url, dependencies = [], params = {}) => {
  /**
   * Fetch data from the provided URL using axios.
   * @function fetchData
   * @returns {Promise} The fetched data.
   */
  const fetchData = async () => {
    try {
      if (!url) {
        return null; // No request should be made when there is no url
      }

      const response = await axiosInstance.get(url, {
        params: params,
      });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Define the query key for caching purposes
  const queryKey = ["data", url, params];

  // Use the useQuery hook to manage fetching and caching
  const { isLoading, isFetching, data, refetch } = useQuery(queryKey, fetchData);

  // Trigger the refetch when dependencies change
  useEffect(() => {
    refetch();
  }, dependencies);

  // Return loading and fetched data information
  return { isLoading, isFetching, data, refetch };
};
