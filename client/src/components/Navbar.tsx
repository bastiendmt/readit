import Axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";
import ReaditLogo from "../images/readit.svg";
import { Sub } from "../types";

const Navbar: React.FC = () => {
  const [name, setName] = useState("");
  const [timer, setTimer] = useState(null);
  const [subs, setSubs] = useState<Sub[]>([]);
  const router = useRouter();

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

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${name}`);
          setSubs(data);
        } catch (err) {
          console.log(err);
        }
      }, 250)
    );
  };

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName("");
  };

  useEffect(() => {
    if (name.trim() === "") {
      setSubs([]);
      return;
    }
    searchSubs();
  }, [name]);

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
      <div className="relative flex items-center mx-auto border rounded bg-gray-100 hover:border-blue-500 hover:bg-white">
        <i className="fas fa-search text-gray-500 pl-4 pr-3"></i>
        <input
          type="text"
          className="py-1 pr-3 rounded focus:outline-none w-160 bg-transparent"
          placeholder="Search"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div
          className="absolute left-0 right-0 bg-white rounded border border-gray-200 shadow-md"
          style={{ top: "100%" }}
        >
          {subs?.map((sub) => (
            <div
              className="flex items-center px-4 py-3 cursor-pointer  hover:bg-gray-200 rounded"
              onClick={() => goToSub(sub.name)}
            >
              <Image
                src={sub.imageUrl}
                className="rounded-full"
                alt="Sub"
                height={(8 * 16) / 4}
                width={(8 * 16) / 4}
              />
              <div className="text-sm ml-4">
                <p className="font-medium">{sub.name}</p>
                <p className="text-gray-600">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
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
