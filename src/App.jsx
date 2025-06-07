import Header from "./components/Header";
import Content from "./layout/Content";
import { AuthProvider } from "./context/auth/AuthProvider";
import { WorkoutProvider } from "./context/workouts/WorkoutProvider";
import { useAuth } from "./context/auth/useAuth";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AuthProvider>
        <WorkoutProvider>
          <AppContent />
        </WorkoutProvider>
      </AuthProvider>
    </div>
  );
}

const AppContent = () => {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Content />
      </main>
    </>
  );
};

export default App;
