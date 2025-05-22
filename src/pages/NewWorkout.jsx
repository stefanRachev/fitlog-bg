import { useState } from "react";

function NewWorkout() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "" },
  ]);

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тук логика за запис във Firebase
    console.log({ title, date, duration, exercises });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Заглавие на тренировката"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Времетраене (мин)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      {exercises.map((ex, i) => (
        <div key={i}>
          <input
            type="text"
            placeholder="Име на упражнение"
            value={ex.name}
            onChange={(e) => handleExerciseChange(i, "name", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Серии"
            value={ex.sets}
            onChange={(e) => handleExerciseChange(i, "sets", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Повторения"
            value={ex.reps}
            onChange={(e) => handleExerciseChange(i, "reps", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Тежест (кг)"
            value={ex.weight}
            onChange={(e) => handleExerciseChange(i, "weight", e.target.value)}
          />
        </div>
      ))}

      <button type="button" onClick={addExercise}>
        Добави упражнение
      </button>
      <button type="submit">Запази тренировка</button>
    </form>
  );
}

export default NewWorkout;
