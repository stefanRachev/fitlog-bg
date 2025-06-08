import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/auth/useAuth";
import { useWorkout } from "../context/workouts/useWorkouts";

const WorkoutDetails = () => {
  const { workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [workoutError, setWorkoutError] = useState(null);

  const { user } = useAuth();
  const { deleteWorkout, loading, error, setError } = useWorkout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const workoutDocRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutDocRef);

        if (workoutSnap.exists()) {
          setWorkout({ id: workoutSnap.id, ...workoutSnap.data() });
        } else {
          setWorkout(null);
          setWorkoutError("Тренировката не е намерена.");
        }
      } catch (err) {
        console.error("Грешка при зареждане на тренировката:", err);
        setWorkoutError("Възникна грешка при зареждане на тренировката.");
      } finally {
        setLoadingWorkout(false);
      }
    };

    fetchWorkout();
  }, [workoutId, user, navigate]);

  const handleDeleteWorkout = async () => {
    const confirmDelete = window.confirm(
      "Сигурни ли сте, че искате да изтриете тази тренировка? Това действие не може да бъде отменено."
    );
    if (!confirmDelete) {
      return;
    }

    const isDeleted = await deleteWorkout(workoutId);

    if (isDeleted) {
      alert("Тренировката е изтрита успешно!");
      navigate("/");
    } else {
      alert(
        "Възникна грешка при изтриване на тренировката. Моля, опитайте отново."
      );
    }
  };

  if (loadingWorkout)
    return (
      <p className="text-center mt-10 text-xl">Зареждане на тренировката...</p>
    );

  if (workoutError || error)
    return (
      <p className="text-center mt-10 text-red-500 text-xl">
        {workoutError || error}
      </p>
    );

  if (!workout)
    return (
      <p className="text-center mt-10 text-xl">
        Няма такава тренировка или нямате достъп до нея.
      </p>
    );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => alert("Функционалността за редактиране предстои!")}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          Редактирай
        </button>
        <button
          onClick={handleDeleteWorkout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Изтриване..." : "Изтрий"}
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6 border-b-2 text-indigo-700">
        {workout.title}
      </h1>
      <p className="mb-2">Дата: {workout.date}</p>
      <p className="mb-2">Продължителност: {workout.duration} минути</p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Упражнения</h2>
        {workout.exercises && workout.exercises.length > 0 ? (
          workout.exercises.map((exercise, exIdx) => (
            <div key={exIdx} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-red-500">
                {exercise.name}
              </h3>
              {exercise.sets && exercise.sets.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Серия</th>
                      <th className="border px-2 py-1">Повторения</th>
                      <th className="border px-2 py-1">Тегло (кг)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIdx) => (
                      <tr key={setIdx}>
                        <td className="border px-2 py-1">{setIdx + 1}</td>
                        <td className="border px-2 py-1">{set.reps}</td>
                        <td className="border px-2 py-1">{set.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Няма въведени серии за това упражнение.</p>
              )}
            </div>
          ))
        ) : (
          <p>Няма въведени упражнения за тази тренировка.</p>
        )}
      </div>

      <Link to="/" className="text-blue-600 hover:underline mt-6 inline-block">
        Обратно към началната
      </Link>
    </div>
  );
};

export default WorkoutDetails;
