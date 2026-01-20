export function FilterSidebar() {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
                <div className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary pl-10 shadow-sm p-2 border"
                        placeholder="Buscar productos..."
                        type="text"
                    />
                    <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">CATEGORÍAS</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        <label className="flex items-center">
                            <input defaultChecked className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Kits de Diagnóstico Básico</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Tipodontos y Modelos</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Instrumentos Rotatorios</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Endodoncia</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Uniformes de Laboratorio</span>
                        </label>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">RANGO DE PRECIO</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative w-full">
                            <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                            <input className="w-full pl-6 py-1 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary border" placeholder="Min" type="number" />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                            <input className="w-full pl-6 py-1 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary border" placeholder="Max" type="number" />
                        </div>
                    </div>
                    <input className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary" max="1000" min="0" type="range" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">MARCAS</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Hu-Friedy</span>
                        </label>
                        <label className="flex items-center">
                            <input defaultChecked className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">Esenciales GEST_EC</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">NSK</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary" type="checkbox" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">3M Oral Care</span>
                        </label>
                    </div>
                </div>
            </div>
        </aside>
    );
}
