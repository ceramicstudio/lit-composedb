import Head from "next/head";
import Nav from "../components/Navbar";
import styles from "./index.module.css";
import Chat from "../components/Chat";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useCeramicContext } from "../../context";
import { authenticateCeramic } from "../../utils";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ILitNodeClient } from "@lit-protocol/types";

const Home: NextPage = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [loggedIn, setLoggedIn] = useState(false);
  const [lit, setLit] = useState<ILitNodeClient>();
  const [address, setAddress] = useState<string>("");

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    setAddress(accounts[0].toLowerCase());
    setLoggedIn(true);
    const thisLit = startLitClient(window);
    setLit(thisLit);
  };

  const startLitClient = (window: Window): ILitNodeClient => {
    // connect to lit 
    console.log("Starting Lit Client...");
    const client = new LitJsSdk.LitNodeClient({
      url: window.location.origin
    });
    client.connect();
    return client as ILitNodeClient;
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    } else {
      setLoggedIn(false);
    }
  }, []);
  return (
    <>
      <Nav />
      <Head>
        <title>Ceramic Message Board with LIT</title>
        <meta
          name="description"
          content="A proof-of-concept application that uses LIT Protocol with storage on Ceramic using ComposeDB."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loggedIn ? (
        <main className={styles.main}>
          <h1 className={styles.title}>
            ComposeDB <span className={styles.pinkSpan}>with</span> LIT
          </h1>
          {lit && <Chat address={address} lit={lit} />}
        </main>
      ) : (
        <main className={styles.main}>
          <button
            type="button"
            className="px-8 py-2 text-xs font-medium text-center text-white bg-purple-500 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50"
            onClick={() => handleLogin()}
          >
            Sign In with Ceramic
          </button>
        </main>
      )}
    </>
  );
};

export default Home;
