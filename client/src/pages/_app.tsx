import Axios from "axios";
import { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
import { SWRConfig } from "swr";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/auth";
import "../styles/icons.css";
import "../styles/tailwind.css";

Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  console.log(`getting ${url}`);
  try {
    const res = await Axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (err) {
    throw err.repsonse.data;
  }
};

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher: (url) => Axios.get(url).then((res) => res.data),
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
