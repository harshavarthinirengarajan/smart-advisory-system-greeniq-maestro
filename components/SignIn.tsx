import React from 'react';
import { Card } from './Card';
import { LeafIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface SignInProps {
  onSignIn: () => void;
}

const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const { t } = useTranslations();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg inline-block">
                <LeafIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold font-display text-primary-800 tracking-tight">
                {t('appName')}
              </h1>
            </div>
            <p className="text-gray-600 mt-2">{t('appSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('emailLabel')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="farmer@greeniq.com"
                  className="w-full bg-white/80 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">
                {t('passwordLabel')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password"
                  className="w-full bg-white/80 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"/>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t('rememberMe')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('forgotPassword')}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-300 transform hover:scale-105"
              >
                {t('signIn')}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};