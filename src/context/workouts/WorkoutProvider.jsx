// src/context/workout/WorkoutProvider.js

import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../auth/useAuth";
import { WorkoutContext } from "./WorkoutContext";

const PAGE_SIZE = 7;

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

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

      const dateToStore = new Date(workoutData.date);

      await addDoc(workoutsRef, {
        ...workoutData,
        date: dateToStore,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      setWorkouts([]);
      setLastVisible(null);
      setHasMore(true);
      await fetchWorkouts(false);
      return true;
    } catch (err) {
      console.error("Error adding workout:", err);
      setError("Грешка при запис на тренировката: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("Трябва да си влязъл в профила си, за да изтриеш тренировка.");
      return false;
    }

    setLoading(true);

    try {
      const workoutDocRef = doc(db, "users", user.uid, "workouts", workoutId);
      await deleteDoc(workoutDocRef);

      setSuccess(true);

      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((w) => w.id !== workoutId)
      );
      return true;
    } catch (err) {
      console.error("Грешка при изтриване на тренировката:", err);
      setError("Грешка при изтриване на тренировката: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Зарежда тренировки за логнатия потребител от Firestore с пагинация.
   * @param {boolean} loadMore - Дали да зареди следващата порция данни (true) или първата (false).
   */
  const fetchWorkouts = async (loadMore = false) => {
    if (!user) {
      setWorkouts([]);
      setLastVisible(null);
      setHasMore(false);
      return;
    }

    setError(null);

    try {
      const workoutsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "workouts"
      );

      let q;
      if (loadMore && lastVisible) {
        q = query(
          workoutsCollectionRef,
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else {
        q = query(
          workoutsCollectionRef,
          orderBy("date", "desc"),
          limit(PAGE_SIZE)
        );
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setHasMore(false);

        if (!loadMore) {
          setWorkouts([]);
        }
        return;
      }

      const loadedWorkouts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        let workoutDate = null;
        if (data.date) {
          if (typeof data.date.toDate === "function") {
            workoutDate = data.date.toDate();
          } else if (typeof data.date === "string") {
            workoutDate = new Date(data.date);
          }
        }
        return {
          id: doc.id,
          ...data,
          date: workoutDate,
          createdAt: data.createdAt?.toDate(),
        };
      });

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      if (loadMore) {
        setWorkouts((prev) => [...prev, ...loadedWorkouts]);
      } else {
        setWorkouts(loadedWorkouts);
      }

      setHasMore(querySnapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Грешка при зареждане на тренировките:", err);
      setError("Грешка при зареждане на тренировките: " + err.message);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  useEffect(() => {
    if (user) {
      setWorkouts([]);
      setLastVisible(null);
      setHasMore(true);
      setLoadingWorkouts(true);
      fetchWorkouts(false);
    } else {
      setWorkouts([]);
      setLastVisible(null);
      setHasMore(false);
      setLoadingWorkouts(false);
    }
  }, [user]);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        deleteWorkout,
        fetchWorkouts,
        loading,
        loadingWorkouts,
        error,
        success,
        setError,
        setSuccess,
        hasMore,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

WorkoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
