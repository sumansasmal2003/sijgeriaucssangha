import React, { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';

const CustomDropdown = ({ label, options, selected, setSelected, icon: Icon }) => {
    const selectedOption = options.find(option => option.value === selected);

    return (
        <div className="relative">
            <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                    <>
                        <Listbox.Label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">
                            {label}
                        </Listbox.Label>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-background border-2 border-border/50 py-3.5 pl-4 pr-12 text-left focus:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-300 group hover:border-primary/30">
                                <span className="flex items-center gap-3">
                                    {Icon && (
                                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                                            <Icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                    )}
                                    <span className="block truncate text-text-primary font-semibold">
                                        {selectedOption?.name}
                                    </span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <motion.div
                                        animate={{ rotate: open ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown
                                            className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors duration-300"
                                            aria-hidden="true"
                                        />
                                    </motion.div>
                                </span>

                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Listbox.Button>

                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-surface border-2 border-border/50 py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                                            {options.map((option, index) => (
                                                <Listbox.Option
                                                    key={option.value}
                                                    className={({ active }) =>
                                                        `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-all duration-200 ${
                                                            active
                                                            ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-text-primary'
                                                            : 'text-text-secondary'
                                                        }`
                                                    }
                                                    value={option.value}
                                                >
                                                    {({ selected }) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span className={`block truncate ${selected ? 'font-black text-text-primary' : 'font-semibold'}`}>
                                                                {option.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-primary">
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 500 }}
                                                                    >
                                                                        <Check className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                                                    </motion.div>
                                                                </span>
                                                            ) : null}
                                                        </motion.div>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    );
};

export default CustomDropdown;
