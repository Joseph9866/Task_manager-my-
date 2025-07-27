import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<string>('taskmaster');

  useEffect(() => {
    // Get theme from localStorage or default to 'taskmaster'
    const savedTheme = localStorage.getItem('taskmaster_theme') || 'taskmaster';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'taskmaster' ? 'taskmaster_dark' : 'taskmaster';
    setTheme(newTheme);
    localStorage.setItem('taskmaster_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
};