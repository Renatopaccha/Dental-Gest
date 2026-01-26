"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";

export function Navbar() {
    const [isDark, setIsDark] = useState(false);
    const { getItemCount, openCart } = useCart();
    const itemCount = getItemCount();

    useEffect(() => {
        // Check initial preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <Image
                                    src="/tooth-icon.png"
                                    alt="Dental Gest_Ec"
                                    width={45}
                                    height={45}
                                    className="drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-[0.2em] uppercase">
                                    Dental
                                </span>
                                <span className="text-xl font-bold tracking-tight">
                                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                                        Gest
                                    </span>
                                    <span className="text-slate-400 dark:text-slate-500">_</span>
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Ec
                                    </span>
                                </span>
                            </div>
                        </Link>
                        <div className="hidden md:flex space-x-8 items-center">
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition" href="/catalogo">Estudiantes</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition" href="/catalogo">Profesionales</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition" href="/catalogo">Categorías</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition" href="#">Sobre Nosotros</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-slate-500 dark:text-slate-400 hover:text-primary transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                            <button
                                onClick={openCart}
                                className="text-slate-500 dark:text-slate-400 hover:text-primary transition relative"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-pulse">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {isDark ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <CartDrawer />
        </>
    );
}

