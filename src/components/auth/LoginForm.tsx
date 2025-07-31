import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authApi";
import { type LoginFormValues } from "../../types/auth";

const initialValues: LoginFormValues = {
  username: "",
  password: "",
};

const LoginForm = () => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(values);
      localStorage.setItem("token", data.token || "");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Nombre de usuario
        </label>
        <input
          id="username"
          name="username"
          type="username"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.username}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-between items-center">
        <Link to="/register" className="text-blue-600 text-sm">
          ¿No tienes cuenta? Regístrate
        </Link>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;