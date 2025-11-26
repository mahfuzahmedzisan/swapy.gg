

import React, { useState } from 'react';
import { LucideIcon, X, CheckCircle, AlertOctagon, Check, ChevronDown, ChevronUp, Code } from 'lucide-react';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
  <div className="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none">
    {toasts.map(toast => (
      <div key={toast.id} className={`flex items-center px-4 py-3 rounded-lg shadow-xl border ${toast.type === 'success' ? 'bg-nexus-card border-green-500 text-green-400' : 'bg-nexus-card border-red-500 text-red-400'} animation-fade-in pointer-events-auto`}>
         {toast.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertOctagon size={18} className="mr-2" />}
         <span className="text-sm font-medium">{toast.message}</span>
      </div>
    ))}
  </div>
);

export const DevNote: React.FC<{ title?: string; children: React.ReactNode }> = ({ title = 'Backend Requirement', children }) => (
  <div className="my-4 p-4 border-l-4 border-blue-500 bg-blue-900/20 rounded-r-lg font-mono text-xs text-blue-200 relative">
    <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-blue-400">
      <Code size={14} />
      {title}
    </div>
    <div className="leading-relaxed opacity-90 whitespace-pre-line">
      {children}
    </div>
  </div>
);

export const Checkbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-3 cursor-pointer group" onClick={onChange}>
    <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all ${checked ? 'bg-nexus-primary border-nexus-primary' : 'bg-[#150d22] border-[#2f264a] group-hover:border-gray-500'}`}>
      {checked && <Check size={14} className="text-white stroke-[3]" />}
    </div>
    <span className={`text-sm font-medium transition-colors ${checked ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
      {label}
    </span>
  </div>
);

export const RadioCard: React.FC<{ title: string, subtitle?: string, image?: string, selected: boolean, onClick: () => void }> = ({ title, subtitle, image, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative rounded-xl p-4 cursor-pointer border-2 transition-all duration-200 group overflow-hidden ${
      selected 
        ? 'bg-nexus-card border-nexus-gold shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
        : 'bg-nexus-card border-nexus-border hover:border-gray-600'
    }`}
  >
    {selected && (
      <div className="absolute top-0 right-0 bg-nexus-gold text-black p-1 rounded-bl-lg z-10">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
    
    <div className="flex flex-col h-full">
      <div className="aspect-[16/9] mb-3 rounded-lg overflow-hidden bg-[#0f0518] relative">
         {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase">No Image</div>
         )}
      </div>
      <div className="mt-auto">
        <h4 className={`font-bold text-sm ${selected ? 'text-nexus-gold' : 'text-white'}`}>{title}</h4>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export const FilterDropdown: React.FC<{ label: string, options?: string[], value?: string, onChange?: (val: string) => void }> = ({ label, options = [], value, onChange }) => (
  <div className="relative group min-w-[140px]">
    <button className="w-full flex items-center justify-between bg-[#130b24] border border-[#2f264a] hover:border-nexus-primary text-gray-300 text-sm px-4 py-2.5 rounded-full transition-all">
      <span>{value || label}</span>
      <ChevronDown size={14} className="ml-2 text-gray-500 group-hover:text-white" />
    </button>
    {/* Mock Dropdown for visual purposes - in real app would use state to toggle visibility */}
  </div>
);

export const Accordion: React.FC<{ title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean, className?: string }> = ({ title, children, defaultOpen = false, className = '' }) => {
   const [isOpen, setIsOpen] = useState(defaultOpen);
   return (
      <div className={`border border-nexus-border rounded-lg bg-nexus-card overflow-hidden ${className}`}>
         <button 
            className="w-full flex justify-between items-center p-3 text-sm font-bold text-white hover:bg-nexus-hover transition-colors"
            onClick={() => setIsOpen(!isOpen)}
         >
            {title}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
         </button>
         {isOpen && (
            <div className="p-3 border-t border-nexus-border animate-fade-in bg-nexus-main/30">
               {children}
            </div>
         )}
      </div>
   );
};

export const TagPill: React.FC<{ text: string }> = ({ text }) => (
  <span className="px-2 py-1 rounded bg-[#150d22] border border-[#2f264a] text-[10px] font-medium text-gray-400 uppercase tracking-wide">
    {text}
  </span>
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'purple' | 'gold' | 'instant', className?: string }> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-nexus-hover text-gray-300',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    purple: 'bg-nexus-primary/10 text-nexus-primary border border-nexus-primary/20',
    gold: 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20',
    outline: 'border border-nexus-border text-gray-400 bg-transparent',
    instant: 'bg-[#2a2205] text-[#fbbf24] border border-[#fbbf24]/30'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-wide inline-flex items-center ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'accent' | 'gradient' | 'gold' | 'success', icon?: LucideIcon, fullWidth?: boolean, size?: 'sm' | 'md' | 'lg' }> = ({ 
  children, variant = 'primary', className = '', icon: Icon, fullWidth = false, size = 'md', ...props 
}) => {
  const base = "inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wide";
  const widthClass = fullWidth ? "w-full" : "";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  const variants = {
    primary: "bg-nexus-primary hover:bg-nexus-primaryHover text-white shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:-translate-y-0.5",
    accent: "bg-nexus-accent hover:bg-cyan-400 text-black font-bold",
    secondary: "bg-nexus-hover hover:bg-nexus-border text-white border border-nexus-border",
    danger: "bg-nexus-danger hover:bg-red-600 text-white",
    ghost: "text-gray-400 hover:text-white hover:bg-nexus-hover",
    outline: "bg-transparent border border-nexus-border text-white hover:border-nexus-primary hover:text-nexus-primary",
    gradient: "bg-gradient-to-r from-[#7c3aed] to-[#9333ea] hover:from-[#8b5cf6] hover:to-[#a855f7] text-white shadow-lg shadow-purple-900/50",
    gold: "bg-nexus-gold hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40",
    success: "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20"
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`} {...props}>
      {Icon && <Icon size={size === 'sm' ? 14 : 18} className="mr-2" />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string, action?: React.ReactNode, noPadding?: boolean }> = ({ children, className = '', title, action, noPadding = false }) => (
  <div className={`bg-nexus-card border border-nexus-border rounded-xl overflow-hidden shadow-lg ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-nexus-border flex justify-between items-center bg-nexus-header/30">
        {title && <h3 className="text-base font-bold text-white">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className={noPadding ? '' : 'p-6'}>
      {children}
    </div>
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: LucideIcon, rightElement?: React.ReactNode, onRightElementClick?: () => void }> = ({ label, icon: Icon, rightElement, onRightElementClick, className = '', ...props }) => (
  <div className="w-full relative">
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={16} className="text-gray-500 group-focus-within:text-nexus-primary transition-colors" />
        </div>
      )}
      <input 
        className={`w-full bg-[#150d22] border border-[#2f264a] rounded-lg ${Icon ? 'pl-10' : 'px-4'} py-2.5 text-white focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary placeholder-gray-600 transition-all ${className}`}
        {...props} 
      />
      {rightElement && (
        <div 
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${onRightElementClick ? 'cursor-pointer hover:text-nexus-primary' : ''}`}
          onClick={onRightElementClick}
        >
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full relative">
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <textarea 
      className={`w-full bg-[#150d22] border border-[#2f264a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary placeholder-gray-600 transition-all ${className}`}
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, className = '', ...props }) => (
  <div className="w-full relative">
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <div className="relative">
        <select 
        className={`w-full bg-[#150d22] border border-[#2f264a] rounded-lg pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary placeholder-gray-600 transition-all appearance-none cursor-pointer ${className}`}
        {...props} 
        >
        {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
        </div>
    </div>
  </div>
);

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-3xl' };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`bg-nexus-card border border-nexus-border w-full ${sizes[size]} rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animation-fade-in`}>
        <div className="px-6 py-4 border-b border-nexus-border flex justify-between items-center bg-nexus-header">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string, subtitle?: string, action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Breadcrumbs: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex items-center text-xs text-gray-500 mb-6">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <span className={index === items.length - 1 ? 'text-white font-medium' : 'hover:text-nexus-primary cursor-pointer transition-colors'}>{item}</span>
        {index < items.length - 1 && <span className="mx-2">/</span>}
      </React.Fragment>
    ))}
  </div>
);
