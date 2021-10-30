import Axios from "axios";
import { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
import Navbar from "../components/Navbar";
import "../styles/icons.css";
import "../styles/tailwind.css";


Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default App;
