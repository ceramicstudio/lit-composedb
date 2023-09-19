import { type AppType } from "next/dist/shared/lib/utils";
import {CeramicWrapper} from "../../context";
import type { AppProps } from 'next/app'
import "~/styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
    <CeramicWrapper>
      <Component {...pageProps} ceramic />
    </CeramicWrapper>
    </>
  );
}

export default MyApp
