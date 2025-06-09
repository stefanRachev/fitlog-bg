import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { useWorkout } from "../context/workouts/useWorkouts";

const Home = () => {
  const { user } = useAuth();
  const { workouts, fetchWorkouts, loadingWorkouts, hasMore, error } =
    useWorkout();

  const handleLoadMore = () => {
    fetchWorkouts(true);
  };

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

          {loadingWorkouts && workouts.length === 0 && (
            <p className="text-center mt-4 text-gray-600">
              Зареждане на тренировки...
            </p>
          )}
          {error && (
            <p className="text-center mt-4 text-red-500">
              Грешка при зареждане: {error}
            </p>
          )}

          {!loadingWorkouts && workouts.length === 0 && (
            <p className="text-center text-gray-500">
              Все още няма записи. Добавете първата тренировка!
            </p>
          )}

          {workouts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold mb-2">{workout.title}</h3>
                  <p className="text-gray-600 mb-2">
                    {" "}
                    Дата:{" "}
                    {workout.date
                      ? workout.date.toLocaleDateString("bg-BG")
                      : "Няма дата"}
                  </p>
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
          )}

          {hasMore && !loadingWorkouts && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
                disabled={loadingWorkouts}
              >
                {loadingWorkouts ? "Зареждане..." : "Зареди още"}
              </button>
            </div>
          )}
          {!hasMore && workouts.length > 0 && !loadingWorkouts && (
            <p className="text-center mt-4 text-gray-500">
              Всички тренировки са заредени.
            </p>
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
