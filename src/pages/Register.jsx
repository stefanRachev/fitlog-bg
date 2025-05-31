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
    setError("");

    const { username, email, password, repeatPassword } = formData;

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !repeatPassword.trim()
    ) {
      setError("Всички полета са задължителни.");
      setIsSubmitting(false);
      return;
    }

    if (username.length < 3) {
      setError("Потребителското име трябва да съдържа поне 3 символа.");
      setIsSubmitting(false);
      return;
    }
    if (password !== repeatPassword) {
      setError("Паролите не съвпадат!");
      setIsSubmitting(false);
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Въведете валиден имейл адрес!");
      setIsSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setError("Паролата трябва да съдържа поне 6 символа.");
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
      console.error("Firebase register error:", error.code);

      if (error.code === "auth/email-already-in-use") {
        setError("Този имейл адрес вече е регистриран.");
      } else if (error.code === "auth/invalid-email") {
        setError("Невалиден формат на имейла. Моля, въведете коректен имейл.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError(
          "Регистрацията с имейл и парола не е активирана. Моля, свържете се с администратор."
        );
      } else if (error.code === "auth/weak-password") {
        setError(
          "Паролата е твърде слаба. Моля, изберете по-силна парола (минимум 6 символа)."
        );
      } else {
        setError("Регистрацията е неуспешна. Моля, опитайте отново.");
      }
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
