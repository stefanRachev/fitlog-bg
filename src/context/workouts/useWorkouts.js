import { useContext } from "react";
import { WorkoutContext } from "./WorkoutContext";

export const useWorkout = () => {
  return useContext(WorkoutContext);
};