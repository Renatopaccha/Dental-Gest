"use client";

interface ComingSoonProps {
    title?: string;
    subtitle?: string;
    audienceType?: "STUDENT" | "PROFESSIONAL" | "GENERAL";
}

export function ComingSoon({
    title = "Sección en Construcción",
    subtitle = "Estamos preparando el mejor catálogo para ti.",
    audienceType = "PROFESSIONAL"
}: ComingSoonProps) {
    // Configuración según tipo de audiencia
    const config = {
        PROFESSIONAL: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 sm:w-24 sm:h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
            ),
            defaultTitle: "Área Profesional en Construcción",
            defaultSubtitle: "Estamos preparando el mejor catálogo de equipos de esterilización y consultorio para ti.",
            gradient: "from-violet-500 to-purple-600",
            bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20"
        },
        STUDENT: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 sm:w-24 sm:h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
            ),
            defaultTitle: "Sección Estudiantes en Construcción",
            defaultSubtitle: "Pronto tendremos los mejores insumos y kits para tu formación odontológica.",
            gradient: "from-cyan-500 to-blue-600",
            bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20"
        },
        GENERAL: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 sm:w-24 sm:h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            defaultTitle: "Próximamente",
            defaultSubtitle: "Estamos trabajando para traerte los mejores productos.",
            gradient: "from-slate-500 to-gray-600",
            bgGradient: "from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20"
        }
    };

    const currentConfig = config[audienceType];
    const displayTitle = title !== "Sección en Construcción" ? title : currentConfig.defaultTitle;
    const displaySubtitle = subtitle !== "Estamos preparando el mejor catálogo para ti." ? subtitle : currentConfig.defaultSubtitle;

    return (
        <div className="flex-grow min-w-0 flex items-center justify-center py-12 sm:py-16 lg:py-24">
            <div className={`w-full max-w-lg mx-auto text-center px-6 py-12 sm:py-16 rounded-3xl bg-gradient-to-br ${currentConfig.bgGradient} border border-slate-200/50 dark:border-slate-700/50`}>
                {/* Icono animado */}
                <div className={`inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${currentConfig.gradient} text-white mb-6 sm:mb-8 shadow-xl shadow-${audienceType === 'PROFESSIONAL' ? 'violet' : 'cyan'}-500/25`}>
                    <div className="animate-pulse">
                        {currentConfig.icon}
                    </div>
                </div>

                {/* Título */}
                <h2 className={`text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r ${currentConfig.gradient} bg-clip-text text-transparent`}>
                    {displayTitle}
                </h2>

                {/* Subtítulo */}
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-8">
                    {displaySubtitle}
                </p>

                {/* Indicador de progreso animado */}
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Cargando novedades</span>
                    <div className="flex gap-1">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentConfig.gradient} animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentConfig.gradient} animate-bounce`} style={{ animationDelay: '150ms' }}></span>
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentConfig.gradient} animate-bounce`} style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
