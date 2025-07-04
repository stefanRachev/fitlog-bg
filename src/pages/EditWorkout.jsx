// src/pages/EditWorkout.js

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { useWorkout } from "../context/workouts/useWorkouts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function EditWorkout() {
  const { workoutId } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([]);
  const [comments, setComments] = useState("");
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [initialDataError, setInitialDataError] = useState(null);

  const { user } = useAuth();

  const {
    updateWorkout,
    loading,
    error,
    success,
    setSuccess,
    setError: setWorkoutContextError,
  } = useWorkout();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchExistingWorkout = async () => {
      if (!user || !workoutId) {
        setLoadingInitialData(false);
        return;
      }

      try {
        const workoutDocRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutDocRef);

        if (workoutSnap.exists()) {
          const data = workoutSnap.data();

          let workoutDate = null;
          if (data.date) {
            if (typeof data.date.toDate === "function") {
              workoutDate = data.date.toDate();
            } else if (typeof data.date === "string") {
              workoutDate = new Date(data.date);
            }
          }

          setTitle(data.title || "");
          setDate(workoutDate ? workoutDate.toISOString().slice(0, 10) : "");
          setDuration(data.duration || "");
          setExercises(data.exercises || []);
          setComments(data.comments || "");
        } else {
          setInitialDataError("Тренировката не е намерена.");
        }
      } catch (err) {
        console.error(
          "Грешка при зареждане на тренировката за редактиране:",
          err
        );
        setInitialDataError(
          "Възникна грешка при зареждане на тренировката за редактиране."
        );
      } finally {
        setLoadingInitialData(false);
      }
    };

    fetchExistingWorkout();
  }, [workoutId, user]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: [{ reps: "", weight: "" }] },
    ]);
  };

  const removeExercise = (indexToRemove) => {
    setExercises(exercises.filter((_, i) => i !== indexToRemove));
  };

  const addSetToExercise = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: "", weight: "" });
    setExercises(newExercises);
  };

  const removeSetFromExercise = (exerciseIndex, setIndexToRemove) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter(
      (_, i) => i !== setIndexToRemove
    );
    setExercises(newExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleExerciseNameChange = (index, value) => {
    const newExercises = [...exercises];
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // логика за филтриране на празни упражнения/серии
    // да са задължителни.
    const filteredExercises = exercises
      .map((exercise) => ({
        ...exercise,
        sets: exercise.sets.filter((set) => set.reps || set.weight),
      }))
      .filter((exercise) => exercise.name || exercise.sets.length > 0);

    const updatedWorkout = {
      title,
      date,
      duration: Number(duration),
      exercises: filteredExercises,
      comments,
    };

    setWorkoutContextError(null);

    const isSuccess = await updateWorkout(workoutId, updatedWorkout);

    if (isSuccess) {
      setTimeout(() => {
        setSuccess(false);
        navigate(`/workout/${workoutId}`);
      }, 1000);
    }
  };

  if (loadingInitialData) {
    return (
      <p className="text-center mt-10 text-xl">
        Зареждане на данни за редактиране...
      </p>
    );
  }

  if (initialDataError) {
    return (
      <p className="text-center mt-10 text-red-500 text-xl">
        {initialDataError}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-4 md:p-6 border rounded-2xl bg-white shadow-md"
    >
      <h2 className="text-xl font-bold text-center">Редактирай тренировка</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">Тренировката е запазена успешно!</p>
      )}
      <input
        type="text"
        placeholder="Заглавие на тренировката"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border rounded-lg px-3 py-2"
      />

      <input
        type="number"
        placeholder="Времетраене (мин)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      {exercises.map((exercise, i) => (
        <div key={i} className="p-4 border rounded-lg bg-gray-100 mb-4">
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="Име на упражнение"
              value={exercise.name}
              onChange={(e) => handleExerciseNameChange(i, e.target.value)}
              className="border p-2 w-full"
            />

            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(i)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition self-end"
                title="Премахни упражнение"
              >
                Премахни упражнение
              </button>
            )}
          </div>

          {exercise.sets.map((set, j) => (
            <div key={j} className="flex flex-col gap-2 my-2">
              <input
                type="number"
                placeholder="Повторения"
                value={set.reps}
                onChange={(e) => handleSetChange(i, j, "reps", e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="number"
                placeholder="Тежест (кг)"
                value={set.weight}
                onChange={(e) =>
                  handleSetChange(i, j, "weight", e.target.value)
                }
                className="border p-2 w-full"
              />
              {exercise.sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSetFromExercise(i, j)}
                  className="bg-red-400 text-white px-2 py-1 rounded-lg hover:bg-red-500 transition self-end"
                  title="Премахни серия"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSetToExercise(i)}
            className="bg-green-500 text-white px-3 py-1 rounded mt-2 hover:bg-green-600 transition"
          >
            Добави серия
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addExercise}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Добави упражнение
      </button>

      <textarea
        placeholder="Допълнителни бележки или коментари за тренировката..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        rows="4"
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Записване..." : "Запази промените"}
      </button>
    </form>
  );
}

export default EditWorkout;
