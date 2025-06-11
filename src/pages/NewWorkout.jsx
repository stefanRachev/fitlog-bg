// NewWorkout.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/useAuth";
import { useWorkout } from "../context/workouts/useWorkouts";
import { useNavigate } from "react-router-dom";

function NewWorkout() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: [{ reps: "", weight: "" }] },
  ]);

  const { user } = useAuth();
  const { addWorkout, loading, error, success, setSuccess } = useWorkout();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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

    // Може да добавиш тук логика за филтриране на празни упражнения/серии
    // преди изпращане, ако искаш да са задължителни.
    // Например:
    const filteredExercises = exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.filter(set => set.reps || set.weight) 
    })).filter(exercise => exercise.name || exercise.sets.length > 0); 

    const workout = {
      title,
      date,
      duration: Number(duration),
      exercises: filteredExercises, 
    };

    const isSuccess = await addWorkout(workout);

    if (isSuccess) {
      setTitle("");
      setDate("");
      setDuration("");
      setExercises([{ name: "", sets: [{ reps: "", weight: "" }] }]);
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 1000);
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
      {exercises.map((exercise, i) => (
        <div key={i} className="p-4 border rounded-lg bg-gray-100 mb-4"> 
          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Име на упражнение"
              value={exercise.name}
              onChange={(e) => handleExerciseNameChange(i, e.target.value)}
              className="border p-2 w-full flex-grow mr-2"
            />
           
            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(i)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                title="Премахни упражнение"
              >
                X
              </button>
            )}
          </div>

          {exercise.sets.map((set, j) => (
            <div key={j} className="flex flex-col md:flex-row gap-2 my-2 items-center"> 
              <input
                type="number"
                placeholder="Повторения"
                value={set.reps}
                onChange={(e) => handleSetChange(i, j, "reps", e.target.value)}
                className="border p-2 flex-1"
              />
              <input
                type="number"
                placeholder="Тежест (кг)"
                value={set.weight}
                onChange={(e) =>
                  handleSetChange(i, j, "weight", e.target.value)
                }
                className="border p-2 flex-1"
              />
            
              {exercise.sets.length > 1 && ( 
                <button
                  type="button"
                  onClick={() => removeSetFromExercise(i, j)}
                  className="bg-red-400 text-white px-2 py-1 rounded-lg hover:bg-red-500 transition self-center"
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

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Записване..." : "Запази тренировка"}
      </button>
    </form>
  );
}

export default NewWorkout;
