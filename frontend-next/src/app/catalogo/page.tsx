import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductCard } from "@/components/shop/ProductCard";
import { products } from "@/lib/data";

export default function Catalog() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            <Navbar />

            <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <nav aria-label="Breadcrumb" className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link className="hover:text-primary transition" href="/">Inicio</Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="material-icons-outlined text-base mx-1">chevron_right</span>
                                            <a className="hover:text-primary transition" href="#">Productos</a>
                                        </div>
                                    </li>
                                    <li aria-current="page">
                                        <div className="flex items-center">
                                            <span className="material-icons-outlined text-base mx-1">chevron_right</span>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">Todos los Productos</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins">Esenciales para Estudiantes</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
                                Equipos de grado profesional seleccionados específicamente para estudiantes de odontología. Kits aprobados para los principales currículos universitarios.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ordenar por:</span>
                            <select className="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:border-primary focus:ring-primary shadow-sm p-2 border">
                                <option>Más populares</option>
                                <option>Precio: Menor a Mayor</option>
                                <option>Precio: Mayor a Menor</option>
                                <option>Nuevos Lanzamientos</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar />

                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <span className="material-icons-outlined">chevron_left</span>
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium">1</button>
                                <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">2</button>
                                <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">3</button>
                                <span className="text-gray-400">...</span>
                                <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">8</button>
                                <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <span className="material-icons-outlined">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
