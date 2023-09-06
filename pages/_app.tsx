import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "@/store";

// css files
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
