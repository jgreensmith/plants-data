//import Image from 'next/image';
import { Plant } from '../types/plant';

interface PlantCardProps {
  plant: Plant;
  onClick: (plant: Plant) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  return (
    <div
      className="border border-gray-300 rounded-lg w-[220px] cursor-pointer shadow-md bg-white p-4 text-center hover:shadow-lg transition-shadow"
      onClick={() => onClick(plant)}
    >
      {/* <Image
        src={plant.imageUrl || '/plant-placeholder.jpg'}
        alt={plant.name}
        width={180}
        height={120}
        className="object-cover rounded-md mx-auto"
      /> */}
      <h2 className="mt-2 text-lg font-medium text-green-900 drop-shadow-sm">{plant.name}</h2>
    </div>
  );
};

export default PlantCard;
