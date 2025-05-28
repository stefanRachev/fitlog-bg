import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { username, email, password, repeatPassword } = formData;

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !repeatPassword.trim()
    ) {
      setError("Всички полета са задължителни.");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }

    if (username.length < 3) {
      setError("Потребителското име трябва да съдържа поне 3 символа.");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password, username);

      setError("");
      setFormData({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Firebase register error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl">
      <h1 className="text-center font-bold text-2xl mt-10 p-4">Регистрация</h1>

      <p className="text-center text-gray-600 text-base mt-6 leading-relaxed bg-red-100 rounded-xl p-2 mx-4">
        Създайте акаунт, за да записвате прогреса си и тренировките безопасно.
        Изискваме по-сигурна парола, за да защитим личната ви информация и
        напредък — все пак това е вашият личен фитнес дневник, не публичен
        профил.
        <br />
        <span className="font-semibold">*</span> Минимум 6 символа. Препоръчваме
        комбинация от букви и цифри.
      </p>
      {error && (
        <p className="text-red-400 text-2xl text-center font-bold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
        <div>
          <label htmlFor="username">Потребителско име</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Въведете потребителско име"
            value={formData.username}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="email">Имейл адрес</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Въведете имейл адрес"
            value={formData.email}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="password">Парола</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Въведете парола"
            value={formData.password}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="repeatPassword">Потвърдете паролата</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            placeholder="Повторете паролата"
            value={formData.repeatPassword}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>

        <button
          className="bg-blue-500 rounded p-2 mx-auto hover:bg-blue-800 text-white transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Моля, изчакайте..." : "Регистрация"}
        </button>
      </form>
    </div>
  );
};

export default Register;
