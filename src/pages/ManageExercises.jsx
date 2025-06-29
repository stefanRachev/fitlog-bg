// src/pages/ManageExercises.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/auth/useAuth";
import { useNavigate } from "react-router-dom";

function ManageExercises() {
  const [exerciseName, setExerciseName] = useState("");
  const [mainMuscleGroup, setMainMuscleGroup] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [exercises, setExercises] = useState([]);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const muscleGroupsOptions = [
    "Гърди",
    "Гръб",
    "Крака",
    "Рамене",
    "Бицепс",
    "Трицепс",
    "Корем",
    "Кардио",
    "Цяло тяло",
    "Други",
  ];

  const fetchExercises = async () => {
    try {
      const q = query(collection(db, "exerciseLibrary"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const fetchedExercises = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExercises(fetchedExercises);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      setMessage("Грешка при зареждане на упражненията.");
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        navigate("/");
        alert("Нямате необходимите права за достъп до тази страница!");
      } else {
        fetchExercises();
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exerciseName || !mainMuscleGroup) {
      setMessage("Име на упражнение и основна мускулна група са задължителни!");
      return;
    }

    if (!user || user.role !== "admin") {
      setMessage("Нямате право да добавяте упражнения!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "exerciseLibrary"), {
        name: exerciseName,
        mainMuscleGroup: mainMuscleGroup,
        description: description,
        videoUrl: videoUrl,
        imageUrl: imageUrl,
      });
      setMessage("Упражнението е добавено успешно!");
      setExerciseName("");
      setMainMuscleGroup("");
      setDescription("");
      setVideoUrl("");
      setImageUrl("");
      fetchExercises();
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Грешка при добавяне на упражнението: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== "admin") {
      setMessage("Нямате право да изтривате упражнения!");
      return;
    }
    if (
      window.confirm("Сигурни ли сте, че искате да изтриете това упражнение?")
    ) {
      setLoading(true);
      setMessage("");
      try {
        await deleteDoc(doc(db, "exerciseLibrary", id));
        setMessage("Упражнението е изтрито успешно!");
        fetchExercises();
      } catch (error) {
        console.error("Error deleting document: ", error);
        setMessage("Грешка при изтриване на упражнението: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="text-center mt-8">
        Зареждане на потребителски данни...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; 
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Управление на упражненията
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Добави ново упражнение</h2>
        {message && (
          <p
            className={`mb-4 ${
              message.includes("Грешка") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Име на упражнението:
          </label>
          <input
            type="text"
            id="name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mainMuscleGroup"
          >
            Основна мускулна група:
          </label>
          <select
            id="mainMuscleGroup"
            value={mainMuscleGroup}
            onChange={(e) => setMainMuscleGroup(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Избери мускулна група</option>
            {muscleGroupsOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Описание (кратки щрихи):
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="videoUrl"
          >
            URL на видео (YouTube):
          </label>
          <input
            type="url" 
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="imageUrl"
          >
            URL на изображение:
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Добавяне..." : "Добави упражнение"}
        </button>
      </form>

    
      <h2 className="text-xl font-semibold mb-4">Налични упражнения</h2>
      {exercises.length === 0 && !loading && <p>Няма добавени упражнения.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold">{exercise.name}</h3>
              <p className="text-gray-600">
                Мускулна група: {exercise.mainMuscleGroup}
              </p>
              {exercise.description && (
                <p className="text-sm mt-2">
                  {exercise.description.substring(0, 100)}...
                </p>
              )}
              {exercise.imageUrl && (
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
              {exercise.videoUrl && (
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm mt-2 block"
                >
                  Виж видео
                </a>
              )}
            </div>
            <button
              onClick={() => handleDelete(exercise.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-4 self-end"
              disabled={loading}
            >
              Изтрий
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageExercises;
