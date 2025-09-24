import React from 'react';

const InputField = ({ id, type, label, icon, value, onChange, placeholder }) => {
  const Icon = icon;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-text-secondary" />
        </span>
        <input
          id={id}
          name={id}
          type={type}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
};

export default InputField;
