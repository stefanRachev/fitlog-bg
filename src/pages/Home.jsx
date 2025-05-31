import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

const PAGE_SIZE = 7;

const Home = () => {
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useAuth();

  const fetchWorkouts = async (loadMore = false) => {
    if (!user) return;
    setLoading(true);

    try {
      const workoutsRef = collection(db, "users", user.uid, "workouts");

      let q = query(workoutsRef, orderBy("date", "desc"), limit(PAGE_SIZE));

      if (loadMore && lastVisible) {
        q = query(
          workoutsRef,
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      }

      const workoutsSnapshot = await getDocs(q);

      if (workoutsSnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const workoutsData = workoutsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible(workoutsSnapshot.docs[workoutsSnapshot.docs.length - 1]);

      if (loadMore) {
        setRecentWorkouts((prev) => [...prev, ...workoutsData]);
      } else {
        setRecentWorkouts(workoutsData);
      }

      if (workoutsSnapshot.docs.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Грешка при зареждане на тренировките:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts(false);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Добре дошли във Вашия Фитнес Дневник!
          </h1>
          <p className="text-xl mb-8">
            Записвайте тренировки, анализирайте прогреса и постигайте целите си.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/new-workout"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
            >
              Добави Тренировка
            </Link>
            <Link
              to="/stats"
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg transition"
            >
              Статистики
            </Link>
          </div>
        </div>
      </section>

      {user && (
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Последни Тренировки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{workout.title}</h3>
                <p className="text-gray-600 mb-2">Дата: {workout.date}</p>
                <p className="text-gray-600">
                  Продължителност: {workout.duration} мин
                </p>

                <Link
                  to={`/workout/${workout.id}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Виж детайли
                </Link>
              </div>
            ))}
          </div>

          {recentWorkouts.length === 0 && !loading && (
            <p className="text-center text-gray-500">
              Все още няма записи. Добавете първата тренировка!
            </p>
          )}

          {loading && (
            <p className="text-center mt-4 text-gray-600">Зареждане...</p>
          )}

          {hasMore && !loading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchWorkouts(true)}
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
              >
                Зареди още
              </button>
            </div>
          )}
        </section>
      )}

      <section className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Как да използвате дневника?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-xs mx-auto">
              <span className="text-4xl">📝</span>
              <h3 className="text-xl font-bold my-3">Записвайте</h3>
              <p>
                Детайли за всяка тренировка: упражнения, тежести, повторения.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-xs mx-auto">
              <span className="text-4xl">📊</span>
              <h3 className="text-xl font-bold my-3">Анализирайте</h3>
              <p>Сравнявайте резултати и проследявайте прогреса.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
