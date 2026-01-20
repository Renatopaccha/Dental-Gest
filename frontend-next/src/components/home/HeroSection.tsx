import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-100/50 dark:bg-cyan-900/10 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary text-sm font-semibold">
                            <span className="material-icons-outlined text-base mr-1">verified</span> Confianza de Universidades y Clínicas
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight font-poppins">
                            Herramientas de Precisión para la <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Excelencia Dental</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg">
                            Equipando a la próxima generación de odontólogos y profesionales experimentados con instrumentos de alta calidad, kits y suministros diarios.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/catalogo" className="px-8 py-4 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1 text-center">
                                Comprar Ahora
                            </Link>
                            <Link href="/catalogo" className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                                <span>Kits para Estudiantes</span>
                                <span className="material-icons-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm relative z-10">
                            <Image
                                alt="Instrumentos dentales de alta calidad en bandeja"
                                className="rounded-2xl w-full h-auto object-cover shadow-sm"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHljTdnVYft2c7ZWc8aB_pE_eLdeZZ63McpTyXh8C4E2qhJQQ9EVyMN6W-ksSSOhQHasEYIkYzxk2Yn3XzxpUukE6GhyTpWm7xNn3gPgouQzEOppCbF0GqDNOHKmTIYCQ0UixuGOO1hvW_cMeQp_k21cNg2JJoVF0HtbTCC9A8DKV9JC5LSu6ndR0ehbd9gRw6p-2DH9vOmWh7WsZMsNDerzpHKP954nWLwjqn9w6nYDYGdYqEZF-U-TyAe-k9gntxcYxOw2MQnDs"
                                width={600}
                                height={400}
                                priority
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-full h-full bg-secondary/10 dark:bg-secondary/5 rounded-3xl -z-10 border border-secondary/20"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
