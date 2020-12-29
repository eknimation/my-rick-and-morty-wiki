import Head from "next/head";
import { useState, useEffect } from "react";

import styles from "../styles/Home.module.css";

const defaultEnpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEnpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEnpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEnpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wubba Lubba Dub Dub!</h1>

        <p className={styles.description}>Rick and Morty Character Wiki</p>

        <ul className={styles.grid}>
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <li key={id} className={styles.card}>
                <img src={image} alt={`${name} Thumbnail`} />
                <a href="#">
                  <h3>{name}</h3>
                </a>
              </li>
            );
          })}
        </ul>

        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
