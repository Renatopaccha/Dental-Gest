import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { products } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />

        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-64">
                <Image
                  alt="Estudiante de odontología practicando"
                  className="object-cover transform group-hover:scale-105 transition duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBV8kFyvqNt3qC4bNR06gql8kGRvncPYZzmUcdZ2fVvQ7v6oQfMWzulWuLrnhI6tWDLzYqXsSMPiqk5QPcLKx-B0XIPk_sffMzQ2Bmn7cHd1ip0TlCuZTC6oUz2jO5U-LuGf8hrlZ5Wupwt6GUh8zXKslxcpMx3OaNS2bwjo88jRMVheFr88td0OsLcAzLj8DLHr0K3_Wxd2_XS7qQMUzvKVlvg9DBvHkVQlX0ijlUYR_OUGtq8xCsd7RhpkePqiiJf3IGIEAy8vc"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 font-poppins">Para Estudiantes</h3>
                  <p className="text-slate-200 mb-4">Kits completos de práctica, maniquíes y modelos de estudio.</p>
                  <span className="text-white text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4 group-hover:text-primary transition">Ver Requisitos</span>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-64">
                <Image
                  alt="Clínica dental profesional"
                  className="object-cover transform group-hover:scale-105 transition duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-i7imLPczDO6HbOMixwSeLUuh7rMLA988nU6HlsJW-sgxpS78Kycv3afoZohvEeMd6ZZT9QWCEFv9i9_Le6lJCXvFk3R9g_aKVMUAtXcxm2QfzbL-qx02jJQt9ccuqFIzpuiwQNkN8aliH0fW35qD26l13r8nT-ZgYcQZEWpYExBleyX12GbBwoZMyBmUiRA5qhu9eRm4eDpwqFd5oZzY6Pe1h4E-8sYoVNi1G1DQWLF-qNpbZS25xM-Yz71tuex7DQC-iOu3rUA"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 font-poppins">Para Profesionales</h3>
                  <p className="text-slate-200 mb-4">Equipos avanzados, consumibles y unidades de esterilización.</p>
                  <span className="text-white text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4 group-hover:text-primary transition">Ver Catálogo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeaturedProducts products={products} />

        <section className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-4">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons-outlined">local_shipping</span>
                </div>
                <h4 className="font-bold text-lg dark:text-white">Entrega Rápida a Nivel Nacional</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Recibe tus suministros en 24-48 horas en cualquier parte del país.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons-outlined">verified_user</span>
                </div>
                <h4 className="font-bold text-lg dark:text-white">Calidad Certificada</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Todos los productos cumplen con estándares médicos y tienen garantía.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons-outlined">school</span>
                </div>
                <h4 className="font-bold text-lg dark:text-white">Descuentos para Estudiantes</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Precios especiales para estudiantes universitarios con identificación válida.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
