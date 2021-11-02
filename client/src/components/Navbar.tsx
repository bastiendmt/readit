import Axios from "axios";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "../context/auth";
import ReaditLogo from "../images/readit.svg";

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = () => {
    Axios.get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white px-5">
      {/* Logo and title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <ReaditLogo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="tex-2xl font-semibold">
          <Link href="/">readit</Link>
        </span>
      </div>

      {/* Search input */}
      <div className="flex items-center mx-auto border rounded bg-gray-100 hover:border-blue-500 hover:bg-white">
        <i className="fas fa-search text-gray-500 pl-4 pr-3"></i>
        <input
          type="text"
          className="py-1 pr-3 rounded focus:outline-none w-160 bg-transparent"
          placeholder="Search"
        ></input>
      </div>

      {/* Auth buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            // Show logout
            <button
              className="w-32 py-1 mr-4 leading-5 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                  log in
                </a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 leading-5 blue button">sign up</a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
