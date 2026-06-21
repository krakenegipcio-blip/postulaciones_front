import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Debe ser un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const login = useAuthStore(state => state.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || 'Error al iniciar sesión');
        return;
      }

      // Success
      login(json.user);
    } catch (err) {
      setServerError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-slate-800/50 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Registro Postulaciones</h1>
          <p className="text-slate-400">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                {...register('email')}
                placeholder="Ingresa tu correo electrónico"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="Ingresa tu contraseña"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-red-400 text-sm text-center">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            ¿No tienes una cuenta?{' '}
            <button onClick={onSwitch} className="text-blue-500 hover:text-blue-400 font-medium">
              creala aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
