import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Register() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Register page</h1>
      </main>
    </div>
  );
}
