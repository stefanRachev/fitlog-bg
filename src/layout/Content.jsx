import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NoFound from "../pages/NoFound";
import Register from "../pages/Register";
import Login from "../pages/Login";
import NewWorkout from "../pages/NewWorkout";
import WorkoutDetails from "../pages/WorkoutDetails";
import EditWorkout from "../pages/EditWorkout";
import ManageExercises from "../pages/ManageExercises";

const Content = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/new-workout" element={<NewWorkout />} />
      <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
      <Route path="/edit-workout/:workoutId" element={<EditWorkout />} />
      <Route path="/manage-exercises" element={<ManageExercises />} />
      <Route path="*" element={<NoFound />} />
    </Routes>
  );
};

export default Content;
