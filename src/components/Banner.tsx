import { Link } from "react-router-dom";

function Banner() {
  return (
    <div className="bg-primary dark:bg-primary-dark p-4 mb-4">
      <nav>
        <Link to={`/`} className="text-xl">
          PokeDox
        </Link>
      </nav>
    </div>
  );
}

export default Banner;
