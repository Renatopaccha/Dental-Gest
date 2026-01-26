import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/tooth-icon.png"
                                alt="Dental Gest_Ec"
                                width={40}
                                height={40}
                                className="drop-shadow-lg"
                            />
                            <div className="flex flex-col leading-tight">
                                <span className="text-[9px] text-slate-500 font-medium tracking-[0.2em] uppercase">
                                    Dental
                                </span>
                                <span className="text-lg font-bold tracking-tight">
                                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        Gest
                                    </span>
                                    <span className="text-slate-500">_</span>
                                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                        Ec
                                    </span>
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-6">
                            Tu socio de confianza para suministros dentales, empoderando a estudiantes y profesionales con las mejores herramientas de la industria.
                        </p>
                        <div className="flex space-x-4">
                            <a className="text-slate-400 hover:text-white transition" href="#"><i className="material-icons-outlined">facebook</i></a>
                            <a className="text-slate-400 hover:text-white transition" href="#"><i className="material-icons-outlined">camera_alt</i></a>
                            <a className="text-slate-400 hover:text-white transition" href="#"><i className="material-icons-outlined">alternate_email</i></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">TIENDA</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link className="hover:text-primary transition" href="/catalogo">Kits para Estudiantes</Link></li>
                            <li><Link className="hover:text-primary transition" href="/catalogo">Instrumentos</Link></li>
                            <li><Link className="hover:text-primary transition" href="/catalogo">Consumibles</Link></li>
                            <li><Link className="hover:text-primary transition" href="/catalogo">Equipos</Link></li>
                            <li><Link className="hover:text-primary transition" href="/catalogo">Uniformes</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">SOPORTE</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link className="hover:text-primary transition" href="#">Contáctanos</Link></li>
                            <li><Link className="hover:text-primary transition" href="#">Preguntas Frecuentes</Link></li>
                            <li><Link className="hover:text-primary transition" href="#">Política de Envíos</Link></li>
                            <li><Link className="hover:text-primary transition" href="#">Devoluciones</Link></li>
                            <li><Link className="hover:text-primary transition" href="#">Rastrear Pedido</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">MANTENTE AL DÍA</h4>
                        <p className="text-sm text-slate-400 mb-4">Suscríbete para recibir ofertas especiales y descuentos para estudiantes.</p>
                        <form className="flex flex-col gap-2">
                            <input className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:border-primary text-sm" placeholder="Tu correo electrónico" type="email" />
                            <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm transition" type="submit">Suscribirse</button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© 2023 Dental GEST_EC. Todos los derechos reservados.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link className="hover:text-white" href="#">Política de Privacidad</Link>
                        <Link className="hover:text-white" href="#">Términos de Servicio</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
