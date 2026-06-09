import React, { createContext, useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from '../components/Toast';
import { styles } from './ToastContext.style';

type ToastContextType = {
  showToast: (message: string, type: 'add' | 'remove') => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'add' | 'remove'>('add');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string, t: 'add' | 'remove') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 2200);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.root}>
        {children}
        <Toast visible={visible} message={message} type={type} />
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
