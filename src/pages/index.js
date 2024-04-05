import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Navbar from "@/components/navbar";
import CardSport from "@/components/cardSport";
import Button from "@/components/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>JustPlay App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.body}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.header}>
            <Button />
            <h2 className={styles.h2}>Vuoi organizzare?</h2>
            <CardSport />
          </div>
        </main>
      </div>
    </>
  );
}
