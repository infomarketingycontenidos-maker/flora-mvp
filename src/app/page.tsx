"use client";

import Image from "next/image";
import { useState } from "react";

type FormState = {
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  monto: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

export default function Home() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    cedula: "",
    telefono: "",
    email: "",
    monto: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<ErrorState>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const digits = (s: string) => s.replace(/\D/g, "");
    const v = name === "cedula" || name === "telefono" ? digits(value) : value;

    setForm((p) => ({ ...p, [name]: v }));
    if (errores[name as keyof ErrorState]) setErrores((p) => ({ ...p, [name]: "" }));
  }

  function validar(values: FormState): ErrorState {
    const e: ErrorState = {};
    if (!values.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!values.cedula.trim()) e.cedula = "La cédula es requerida";
    else if (!/^\d{8,10}$/.test(values.cedula))
      e.cedula = "La cédula debe tener entre 8 y 10 dígitos";
    if (!values.telefono.trim()) e.telefono = "El teléfono es requerido";
    else if (!/^\d{10}$/.test(values.telefono))
      e.telefono = "El teléfono debe tener 10 dígitos";
    if (!values.email.trim()) e.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "El email no es válido";
    if (!values.monto.trim()) e.monto = "Debes seleccionar un monto";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validar(form);
    if (Object.keys(errs).length) return setErrores(errs);

    try {
      setEnviando(true);
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error enviando");
      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
        setForm({ nombre: "", cedula: "", telefono: "", email: "", monto: "" });
      }, 2500);
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Formulario enviado!</h2>
          <p className="text-gray-600">Tus datos fueron procesados.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full shadow-lg">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Formulario de Registro</h1>
          <p className="text-gray-600 text-sm">Completa tus datos para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              autoComplete="name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.nombre ? "border-red-500" : "border-gray-300"}`}
              placeholder="Tu nombre"
            />
            {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
            <input
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.cedula ? "border-red-500" : "border-gray-300"}`}
              placeholder="Número de cédula"
            />
            {errores.cedula && <p className="text-red-500 text-sm mt-1">{errores.cedula}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              inputMode="tel"
              maxLength={10}
              autoComplete="tel"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.telefono ? "border-red-500" : "border-gray-300"}`}
              placeholder="Número de teléfono"
            />
            {errores.telefono && <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="tu@email.com"
            />
            {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <select
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.monto ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Selecciona un monto</option>
              <option value="50000">$50,000</option>
              <option value="97000">$97,000</option>
            </select>
            {errores.monto && <p className="text-red-500 text-sm mt-1">{errores.monto}</p>}
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            {enviando ? "Enviando..." : "Enviar formulario"}
          </button>
        </form>
      </div>
    </main>
  );
}
