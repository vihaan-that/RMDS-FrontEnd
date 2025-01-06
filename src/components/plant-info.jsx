
import Image from "next/image"

export function PlantInfo({ plantName, load, imageUrl }) {
  const currentDate = new Date()

  return (
    <div className="w-full bg-secondary text-secondary-foreground p-4 flex items-center justify-between">
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={`${plantName} Image`}
          width={300}
          height={100}
          className="rounded-lg"
        />
      </div>
      <div className="flex-grow text-center">
        <h2 className="text-3xl font-bold">{plantName}</h2>
      </div>
      <div className="flex-shrink-0 text-right">
        <p>
          <span className="font-semibold">Load:</span> {load}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {currentDate.toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Time:</span>{" "}
          {currentDate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
