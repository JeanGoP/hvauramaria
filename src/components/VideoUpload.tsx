import { useState } from 'react';
import { X, CheckCircle, Link, ExternalLink } from 'lucide-react';

interface UploadedVideo {
  name: string;
  url: string;
}

export default function VideoUpload() {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [externalName, setExternalName] = useState<string>('');

  const handleAddExternalUrl = () => {
    if (!externalUrl.trim()) {
      setError('Por favor ingresa una URL válida');
      return;
    }

    const name = externalName.trim() || 'Video externo';
    setUploadedVideos(prev => [...prev, { name, url: externalUrl }]);
    setExternalUrl('');
    setExternalName('');
    setError(null);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-light text-neutral-900 mb-6">Gestionar Videos del Portafolio</h2>

        <div>
          <h3 className="text-lg font-light text-neutral-900 mb-3 flex items-center gap-2">
            <Link size={20} />
            Agregar URL de Video
          </h3>
          <div className="border border-neutral-300 rounded-lg p-6 bg-neutral-50">
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-neutral-700 mb-1">Nombre del video</label>
                <input
                  type="text"
                  value={externalName}
                  onChange={(e) => setExternalName(e.target.value)}
                  placeholder="Ej: Mi trabajo de fotografía"
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-700 mb-1">URL del video</label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://drive.google.com/... o https://dropbox.com/..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <button
                onClick={handleAddExternalUrl}
                className="w-full px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} />
                Agregar URL
              </button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
              <strong>Cómo obtener URLs directas:</strong>
              <ul className="mt-2 space-y-1 ml-4 list-disc">
                <li>Google Drive: Clic derecho → Obtener enlace → Compartir con cualquiera</li>
                <li>Dropbox: Compartir → Crear enlace → Copiar enlace</li>
                <li>YouTube: Usa la URL del video directamente</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <X size={20} className="text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {uploadedVideos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-light text-neutral-900 mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-green-500" />
              Videos Agregados
            </h3>
            <div className="space-y-4">
              {uploadedVideos.map((video, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-2 font-medium">{video.name}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={video.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(video.url)}
                      className="px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors text-xs whitespace-nowrap"
                    >
                      Copiar URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Próximo paso:</strong> Copia las URLs de arriba y agrégalas a tu portafolio en App.tsx:
              </p>
              <code className="block mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                {`{ type: 'video', src: 'URL_COPIADA', alt: 'Descripción' }`}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
