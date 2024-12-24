import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>BlogApp - Page Not Found</title>
      </Helmet>

      <div className="container flex flex-col justify-between items-center h-[50vh] self-center overflow-hidden">
        <img
          src="https://cdn.dribbble.com/users/1175431/screenshots/6188233/404-error-dribbble-800x600.gif"
          alt="not_found_image"
          className="h-full"
        />
      </div>
      <div className="container flex flex-col self-center justify-between items-center text-black">
        <p className="text-center">
          The page you are looking for not available!
        </p>
        <Link to="/" className="btn-success w-fit">
          Go to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
