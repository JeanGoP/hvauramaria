import { useState, useEffect } from 'react';
import { Menu, X, Mail, Camera, Play } from 'lucide-react';
import VideoUpload from './components/VideoUpload';

interface PortfolioItem {
  id: number;
  type: string;
  src: string;
  alt: string;
  videoUrl?: string;
  thumbnail?: string;
}

interface Video {
  id: number;
  vimeoId?: string;
  src?: string;
  type: string;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Si VITE_API_URL no está definida, usamos una cadena vacía para que la petición sea relativa al dominio actual
            const apiUrl = import.meta.env.VITE_API_URL || ''; 
            
            const itemsRes = await fetch(`${apiUrl}/api/portfolio`);
            if (!itemsRes.ok) throw new Error('Failed to fetch portfolio');
            const items = await itemsRes.json();
            setPortfolioItems(items);

            const videosRes = await fetch(`${apiUrl}/api/videos`);
            if (!videosRes.ok) throw new Error('Failed to fetch videos');
            const videos = await videosRes.json();
            setFeaturedVideos(videos);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['hero', 'work', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className={`text-2xl font-light tracking-wide transition-colors ${
                isScrolled ? 'text-neutral-900' : 'text-white'
              }`}
            >
              Aura María Pérez Barrera
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden transition-colors ${
                isScrolled ? 'text-neutral-900' : 'text-white'
              }`}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <ul className="hidden lg:flex space-x-8 items-center">
              {['Work', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-sm uppercase tracking-widest transition-colors ${
                      isScrolled ? 'text-neutral-700 hover:text-neutral-900' : 'text-white hover:text-neutral-200'
                    } ${activeSection === item.toLowerCase() ? 'font-medium' : 'font-light'}`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {isMenuOpen && (
            <ul className="lg:hidden mt-6 space-y-4 pb-4">
              {['Work', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-neutral-900 text-lg uppercase tracking-widest hover:text-neutral-600 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>


      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 text-center px-6">
          <div className="mb-8 flex justify-center">
            <Camera size={48} className="text-white opacity-90" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight">
            Aura María
            <br />
            <span className="font-normal">Pérez Barrera</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 font-light tracking-wide mb-12">
            Editora & Creadora de Contenido
          </p>
          <button
            onClick={() => scrollToSection('work')}
            className="group bg-white text-neutral-900 px-8 py-3 uppercase tracking-widest text-sm hover:bg-neutral-100 transition-all duration-300"
          >
            Ver Portafolio
            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>

      <section id="work" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">Portafolio</h2>
            <div className="w-20 h-0.5 bg-neutral-900 mx-auto"></div>
          </div>

          <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-neutral-100 break-inside-avoid mb-8"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                {item.type === 'image' ? (
                  <div onClick={() => setSelectedImage(item.src)} className="cursor-pointer">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                ) : item.type === 'video-link' ? (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full relative"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-neutral-900 bg-opacity-40 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-50">
                      <div className="bg-white rounded-full p-6 transform transition-transform duration-300 group-hover:scale-110">
                        <Play size={40} className="text-neutral-900 fill-neutral-900" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <video
                    src={item.src}
                    controls
                    className="w-full h-auto"
                    preload="metadata"
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">Videos Destacados</h2>
            <div className="w-20 h-0.5 bg-neutral-900 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {featuredVideos.map((video, index) => {
              const getEmbedUrl = (src?: string, vimeoId?: string) => {
                if (vimeoId) return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0` };
                
                if (!src) return null;

                // Check for YouTube
                const youtubeMatch = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                if (youtubeMatch) {
                  return { type: 'youtube', url: `https://www.youtube.com/embed/${youtubeMatch[1]}?playsinline=1` };
                }

                // Check for Vimeo URL
                const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
                if (vimeoMatch) {
                  return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0` };
                }

                return { type: 'local', url: src };
              };

              const embed = getEmbedUrl(video.src, video.vimeoId);

              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-neutral-100 rounded-sm aspect-[9/16]`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {embed?.type === 'local' ? (
                    <video
                      src={embed.url}
                      controls
                      playsInline
                      className="w-full h-full object-contain bg-black" // Ocupa todo el contenedor, fondo negro
                      preload="metadata"
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : embed ? (
                    <iframe
                      src={embed.url}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      title={`Video ${index + 1}`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">Acerca de Mí</h2>
            <div className="w-20 h-0.5 bg-neutral-900 mx-auto"></div>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed font-light">
              Soy editora y creadora de contenido con pasión por capturar momentos auténticos y contar historias visuales significativas.
            </p>
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed font-light">
              Mi trabajo se centra en la fotografía editorial, retrato y contenido visual que conecta con las personas de manera genuina.
            </p>
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed font-light">
              Combino sensibilidad artística con técnica profesional para crear contenido que trasciende lo ordinario.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4">Trabajemos Juntos</h2>
            <div className="w-20 h-0.5 bg-white mx-auto"></div>
          </div>

          <p className="text-lg md:text-xl text-neutral-300 mb-12 font-light">
            ¿Tienes un proyecto en mente? Me encantaría escuchar tus ideas.
          </p>

          <a
            href="mailto:aura@example.com"
            className="inline-flex items-center gap-3 bg-white text-neutral-900 px-8 py-4 text-sm uppercase tracking-widest hover:bg-neutral-100 transition-colors duration-300"
          >
            <Mail size={20} />
            Enviar Mensaje
          </a>
        </div>
      </section>

      <footer className="bg-neutral-950 text-neutral-400 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-light tracking-wide">
            © 2025 Aura María Pérez Barrera. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
                onClick={() => setSelectedImage(null)}
            >
                <X size={32} />
            </button>
            <img 
                src={selectedImage} 
                alt="Full quality view" 
                className="max-w-full max-h-full object-contain"
            />
        </div>
      )}
    </div>
  );
}

export default App;
