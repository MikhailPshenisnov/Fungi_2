import { IPublications } from "@pages/Publications/types";
import axios from "axios";

export const fetchPublicationData = async (): Promise<IPublications[]> => {
  try {
    const response = await axios.get("http://localhost:5000/publications");
    return response.data;
  } catch (error) {
    console.error("Error fetching publication data:", error);
    return [];
  }
};
