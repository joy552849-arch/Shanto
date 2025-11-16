import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalStateContext';
import { GeneratedImage } from '../types';
// FIX: Added ImageIcon to the import list to resolve the 'Cannot find name' error.
import { DownloadIcon, TrashIcon, ImageIcon } from '../components/icons/Icons';
import { Link } from 'react-router-dom';

const ImageCard: React.FC<{ image: GeneratedImage; onDelete: (id: string) => void }> = ({ image, onDelete }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `shanto-ai-${image.id}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative group overflow-hidden rounded-lg shadow-lg bg-gray-800 aspect-square">
            <img src={image.url} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">{image.prompt}</p>
                <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={handleDownload} className="p-2 bg-brand-600 hover:bg-brand-700 rounded-full text-white transition">
                        <DownloadIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(image.id)} className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SkeletonLoader: React.FC = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg animate-pulse aspect-square"></div>
);

const DashboardPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
    const [stylePreset, setStylePreset] = useState('photorealistic');

    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { currentUser } = useGlobalState();
    const dispatch = useGlobalDispatch();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        if (currentUser && currentUser.credits < 1) {
            setError("You don't have enough credits. Please buy more.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const fullPrompt = `${prompt}, ${stylePreset}`;
            const imageUrl = await generateImage(fullPrompt, negativePrompt, aspectRatio);
            
            const newImage: GeneratedImage = {
                id: new Date().toISOString(),
                url: imageUrl,
                prompt: prompt,
                createdAt: new Date(),
            };
            setGeneratedImages(prev => [newImage, ...prev]);

            if (currentUser) {
                dispatch({ type: 'UPDATE_CREDITS', payload: { userId: currentUser.id, credits: currentUser.credits - 1 } });
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during image generation.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImage = (id: string) => {
        setGeneratedImages(prev => prev.filter(img => img.id !== id));
    };

    return (
        <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generation Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-white">Image Generation</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} placeholder="e.g., A majestic lion in a futuristic city, neon lights..." className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition p-2"></textarea>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Negative Prompt (Optional)</label>
                                <textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} rows={2} placeholder="e.g., blurry, ugly, disfigured" className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition p-2"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Style Preset</label>
                                <select value={stylePreset} onChange={e => setStylePreset(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition p-2">
                                    <option value="photorealistic">Photorealistic</option>
                                    <option value="digital art">Digital Art</option>
                                    <option value="cinematic">Cinematic</option>
                                    <option value="anime">Anime</option>
                                    <option value="fantasy">Fantasy</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition p-2">
                                    <option value="1:1">Square (1:1)</option>
                                    <option value="3:4">Portrait (3:4)</option>
                                    <option value="4:3">Landscape (4:3)</option>
                                    <option value="9:16">Tall (9:16)</option>
                                    <option value="16:9">Wide (16:9)</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading} className="mt-6 w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center">
                            {isLoading ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Generating...
                                </>
                            ) : "Generate (1 Credit)"}
                        </button>
                        {error && <p className="text-red-400 text-sm mt-4 text-center">{error} {currentUser && currentUser.credits < 1 && <Link to="/buy-credits" className="underline hover:text-red-300">Buy Credits</Link>}</p>}
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-white">Your Session Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {isLoading && <SkeletonLoader />}
                        {generatedImages.map(img => <ImageCard key={img.id} image={img} onDelete={handleDeleteImage} />)}
                    </div>
                    { !isLoading && generatedImages.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 p-10 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 h-full">
                            <ImageIcon className="w-16 h-16 mb-4 text-gray-500" />
                            <h3 className="text-lg font-semibold text-white">Your gallery is empty</h3>
                            <p className="mt-1">Generated images will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;