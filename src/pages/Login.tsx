import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-6 pt-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">bpis caronas</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta</h1>
        <p className="text-muted-foreground mb-8">Entre com suas credenciais</p>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button className="text-sm text-primary font-medium">Esqueceu a senha?</button>
          <Button onClick={handleLogin} className="w-full h-14 text-base font-semibold rounded-2xl gradient-primary text-primary-foreground">
            Entrar
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Não tem conta?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-semibold">Criar conta</button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
