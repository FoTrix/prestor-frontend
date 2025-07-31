import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authApi";
import { type RegisterFormValues } from "../../types/auth";

const initialValues: RegisterFormValues = {
  username: "",
  email: "",
  nombre: "",
  pais: "",
  ciudad: "",
  direccion: "",
  rut: "",
  password: "",
  terms: false,
  acceptedTerms: false,
};

const RegisterForm = () => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "terms" ? { acceptedTerms: checked } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validación básica
    for (const key in values) {
      if (
        key !== "terms" &&
        Object.prototype.hasOwnProperty.call(values, key) &&
        !values[key as keyof RegisterFormValues]
      ) {
        setError("Todos los campos son obligatorios");
        setLoading(false);
        return;
      }
    }
    if (!values.terms) {
      setError("Debes aceptar los términos y condiciones");
      setLoading(false);
      return;
    }

    try {
      await register({ ...values, acceptedTerms: values.terms });
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="text-2xl font-bold text-center">Registrarse</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Nombre de usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium">
          Nombre completo
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="pais" className="block text-sm font-medium">
          País
        </label>
        <input
          id="pais"
          name="pais"
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.pais}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="ciudad" className="block text-sm font-medium">
          Ciudad
        </label>
        <input
          id="ciudad"
          name="ciudad"
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.ciudad}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium">
          Dirección
        </label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.direccion}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="rut" className="block text-sm font-medium">
          RUT
        </label>
        <input
          id="rut"
          name="rut"
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={values.rut}
          onChange={handleChange}
          required
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
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={values.terms}
          onChange={handleChange}
          className="mr-2"
        />
        <span className="text-sm">
          Acepto los{" "}
          <Link to="#" className="text-blue-600 underline">
            términos y condiciones
          </Link>
        </span>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
      <div className="text-center text-sm mt-2">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-blue-600">
          Ingresa
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;