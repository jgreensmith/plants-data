"use client";
import { useState } from 'react';
import Image from 'next/image';
import PlantCard from './PlantCard';
import type { Plant } from '../types/plant';

export default function HomeClient({ plants }: { plants: Plant[] }) {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Plants</h1>
      <div className="flex flex-wrap gap-6">
        {plants.map(plant => (
          <PlantCard key={plant._id} plant={plant} onClick={setSelectedPlant} />
        ))}
      </div>
      {selectedPlant && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelectedPlant(null)}
        >
          <div
            className="bg-white rounded-xl p-8 min-w-[320px] max-w-[400px] shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800 focus:outline-none"
              onClick={() => setSelectedPlant(null)}
              aria-label="Close"
            >
              ×
            </button>
            <Image
              src={selectedPlant.imageUrl || '/plant-placeholder.jpg'}
              alt={selectedPlant.name}
              width={240}
              height={160}
              className="object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{selectedPlant.name}</h2>
            <p className="mb-1"><span className="font-semibold">Description:</span> {selectedPlant.description}</p>
            <p className="mb-1"><span className="font-semibold">Watering:</span> {selectedPlant.watering}</p>
            <p><span className="font-semibold">Light:</span> {selectedPlant.light}</p>
          </div>
        </div>
      )}
    </main>
  );
}
