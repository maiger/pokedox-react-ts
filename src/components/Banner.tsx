import { Link } from "react-router-dom";

function Banner() {
  return (
    <div className="bg-amber-200 p-4 mb-4">
      <nav>
        <Link to={`/`} className="text-xl">
          PokeDox
        </Link>
      </nav>
    </div>
  );
}

export default Banner;
