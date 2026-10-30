import { Link } from "react-router-dom";

interface Item {
  id: number | string;
  img: string;
  title: string;
  url: string;
}

interface ImageCardProps {
  arr: Item[];
}

const ImageCard: React.FC<ImageCardProps> = ({ arr }) => {
  return (
    <div className="flex justify-center flex-wrap">
      {arr.map((item) => (
        <div
          key={item.id}
          className="w-full md:w-2/4 lg:w-1/4 pb-5 px-2 md:px-5"
        >
          <div className="group overflow-hidden rounded bg-white shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl focus-within:-translate-y-2 focus-within:shadow-xl">
            <Link
              to={item.url}
              aria-label={`Explore ${item.title}`}
              className="block overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#4a5c23]"
            >
              <img
                src={item.img}
                alt={`${item.title} | Kyrgyz Tours`}
                className="relative z-10 h-[320px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-within:scale-105"
                loading="lazy"
              />
            </Link>
            {/* Title with link */}
            <div className="flex flex-col items-center px-5 pt-2 pb-2 text-center">
              <Link
                to={item.url}
                className="flex items-center text-[#2A624C] font-medium transition-colors duration-200 hover:text-safari-brown group-hover:text-[#4A5C23] focus-visible:outline-none focus-visible:underline"
              >
                <h3 className="text-[18px] font-semibold">{item.title}</h3>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCard;
