"use client";
import { useState } from 'react';
import Image from 'next/image';
import PlantCard from './PlantCard';
import type { Plant } from '../types/plant';

export default function HomeClient({ plants }: { plants: Plant[] }) {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', watering: '', light: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantsList, setPlantsList] = useState<Plant[]>(plants);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/add-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add plant');
      }
      const newPlant = await res.json();
      setPlantsList([newPlant, ...plantsList]);
      setShowAddModal(false);
      setForm({ name: '', description: '', watering: '', light: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-green-900">Plants</h1>
      {/* Mobile Add Button */}
      <button
        className={`
          block md:hidden
          fixed bottom-0 left-0 w-full
          px-4 py-4
          bg-purple-700 text-white text-lg font-semibold
          rounded-none
          shadow-lg
          z-50
          hover:bg-purple-800 transition
        `}
        style={{ borderRadius: 0 }}
        onClick={() => setShowAddModal(true)}
      >
        Add New Plant
      </button>
      {/* Desktop Add Button */}
      <button
        className={`
          mb-6 px-4 py-2
          bg-purple-700 text-white rounded
          hover:bg-purple-800 transition
          hidden md:block
        `}
        onClick={() => setShowAddModal(true)}
      >
        Add New Plant
      </button>
      <div className="flex flex-wrap gap-6 justify-center">
        {plantsList.map(plant => (
          <PlantCard key={plant._id} plant={plant} onClick={setSelectedPlant} />
        ))}
      </div>

      {/* Add Plant Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(200, 230, 201, 0.95)' }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 min-w-[320px] max-w-[400px] shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800 focus:outline-none"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Plant</h2>
            <form onSubmit={handleAddPlant} className="flex flex-col gap-3">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="watering"
                placeholder="Watering instructions"
                value={form.watering}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="light"
                placeholder="Light requirements"
                value={form.light}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
                required
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Plant'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Plant Details Modal */}
      {selectedPlant && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(200, 230, 201, 0.95)' }}
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
            {/* <Image
              src={selectedPlant.imageUrl || '/plant-placeholder.jpg'}
              alt={selectedPlant.name}
              width={240}
              height={160}
              className="object-cover rounded-lg mb-4"
            /> */}
            <h2 className="text-xl font-semibold mb-2">{selectedPlant.name}</h2>
            <p className="mb-1"><span className="font-semibold">Description:</span> {selectedPlant.description}</p>
            <p className="mb-1"><span className="font-semibold">Watering:</span> {selectedPlant.watering}</p>
            <p><span className="font-semibold">Light:</span> {selectedPlant.light}</p>
            <button
              className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={async () => {
                if (!selectedPlant) return;
                const res = await fetch(`/api/delete-plant?id=${selectedPlant._id}`, { method: 'DELETE' });
                if (res.ok) {
                  setPlantsList(prev => prev.filter(p => p._id !== selectedPlant._id));
                  setSelectedPlant(null);
                } else {
                  alert('Failed to delete plant');
                }
              }}
            >
              Remove Plant
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
