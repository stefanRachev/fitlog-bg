import { useState } from "react";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/auth/useAuth";

const db = getFirestore();

function NewWorkout() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "" },
  ]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Трябва да си влязъл в профила си, за да запазиш тренировка.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const workout = {
      title,
      date,
      duration: Number(duration),
      exercises,
      createdAt: serverTimestamp(),
    };
    try {
      const userRef = doc(db, "users", user.uid);
      const workoutsRef = collection(userRef, "workouts");
      await addDoc(workoutsRef, workout);

      setSuccess(true);
      setTitle("");
      setDate("");
      setDuration("");
      setExercises([{ name: "", sets: "", reps: "", weight: "" }]);
    } catch (err) {
      console.error("Error saving workout:", err);
      setError("Грешка при запис на тренировката.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-4 md:p-6 border rounded-2xl bg-white shadow-md"
    >
      <h2 className="text-xl font-bold text-center">Създай нова тренировка</h2>

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

      {exercises.map((ex, i) => (
        <div key={i} className="flex flex-col gap-3 bg-gray-50 p-3 rounded-lg">
          <input
            type="text"
            placeholder="Име на упражнение"
            value={ex.name}
            onChange={(e) => handleExerciseChange(i, "name", e.target.value)}
            required
            className="border rounded-lg px-2 py-1"
          />
          <input
            type="number"
            placeholder="Серии"
            value={ex.sets}
            onChange={(e) => handleExerciseChange(i, "sets", e.target.value)}
            required
            className="border rounded-lg px-2 py-1"
          />
          <input
            type="number"
            placeholder="Повторения"
            value={ex.reps}
            onChange={(e) => handleExerciseChange(i, "reps", e.target.value)}
            required
            className="border rounded-lg px-2 py-1"
          />
          <input
            type="number"
            placeholder="Тежест (кг)"
            value={ex.weight}
            onChange={(e) => handleExerciseChange(i, "weight", e.target.value)}
            className="border rounded-lg px-2 py-1"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addExercise}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Добави упражнение
      </button>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Запази тренировка
      </button>
    </form>
  );
}

export default NewWorkout;
