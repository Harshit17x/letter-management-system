
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, XIcon } from './icons/Icons';

interface PhotoScannerProps {
    onScan: (base64Image: string) => void;
    onClose: () => void;
}

const PhotoScanner: React.FC<PhotoScannerProps> = ({ onScan, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cleanup = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }, [stream]);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please ensure you have given permission.");
            }
        };

        startCamera();
        
        return cleanup;
    }, [cleanup]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                // Remove the prefix "data:image/jpeg;base64,"
                const base64Image = dataUrl.split(',')[1];
                onScan(base64Image);
                cleanup();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl aspect-video relative flex flex-col overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" title="Live camera feed for scanning" />
                <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

                <div className="absolute top-0 right-0 p-2">
                    <button onClick={() => { cleanup(); onClose(); }} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75" aria-label="Close scanner">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {error && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
                        <p className="text-red-400 font-semibold">{error}</p>
                        <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-600 rounded-md">Close</button>
                    </div>
                )}

                {!error && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                        <button onClick={handleCapture} className="p-4 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg ring-4 ring-white/30" aria-label="Capture image">
                            <CameraIcon className="w-8 h-8" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoScanner;
