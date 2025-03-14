import { useQuery } from "@tanstack/react-query";
import { TMushroomCard } from "../../pages/Encyclopedia/types";
import { mockMushrooms } from "../const/mock/mushrooms";
import { fetchMushroomData } from "@shared/api";

export const useMushroomData = () => {
  return useQuery<TMushroomCard[]>({
    queryKey: ["mushrooms"],
    queryFn: fetchMushroomData,
    initialData: mockMushrooms,
  });
};
