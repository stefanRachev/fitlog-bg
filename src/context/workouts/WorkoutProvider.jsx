// src/context/workout/WorkoutProvider.js

import PropTypes from "prop-types";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 
import { useAuth } from "../auth/useAuth"; 
import { WorkoutContext } from "./WorkoutContext";

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Добавя нова тренировка към колекцията на потребителя във Firestore.
   *
   * @param {object} workoutData - Обект с данните за тренировката, включително title, date, duration, exercises.
   * `date` тук ще бъде стрингът, който потребителят е въвел (пр. "2025-06-07").
   */
  const addWorkout = async (workoutData) => {
  
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("Трябва да си влязъл в профила си, за да запазиш тренировка.");
      return false; 
    }

    setLoading(true); 

    try {
     
      const workoutsRef = collection(db, "users", user.uid, "workouts");

    
      await addDoc(workoutsRef, {
        ...workoutData,
        createdAt: serverTimestamp(),
      });

      setSuccess(true); 
      return true; 
    } catch (err) {
      console.error("Error adding workout:", err);
      setError("Грешка при запис на тренировката: " + err.message); 
      return false; 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        addWorkout,
        loading,
        error,
        success,
        setError,
        setSuccess,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

WorkoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};