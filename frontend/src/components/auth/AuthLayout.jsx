import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = ({ title, children, footerText, footerLink, footerLinkText }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text-primary tracking-tight">
              Sijgeria UCS
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
        </div>

        {children}

        <p className="mt-8 text-center text-sm text-text-secondary">
          {footerText}{' '}
          <Link to={footerLink} className="font-semibold text-primary hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
