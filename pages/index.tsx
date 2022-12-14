import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import main from "../styles/Main.module.css";
import nameId from "../JSON/nameId.json";
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>TRACK TRIVIA - MUSIC QUIZ</title>
        <meta name="Track Trivia" content="TRACK TRIVIA MUSIC QUIZ" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Track Trivia</h1>
        <p className={styles.description}>Test your Music Knowledge</p>
        <div className={styles.grid}>
          <br></br>
          {Object.entries(nameId).map(([name, id]) => {
            const thumbnail = require(`../assets/thumbnails/${id[0]}.jpg`);
            return (
              <Link
                key={id[0]}
                href={`/start/${encodeURIComponent(
                  "artists"
                )}/${encodeURIComponent(id[0])}`}
              >
                <div className={styles.card} data-cy={name}>
                  <div className={main.thumbnailContainer}>
                    <img
                      src={thumbnail.default.src}
                      className={main.thumbnailImg}
                      alt=""
                    ></img>
                  </div>
                  <div className={styles.cardHeaders}>
                    <h2 className={main.header3}>{name} &rarr;</h2>
                    <h4>10 Questions</h4>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noreferrer"
        >
          Made by Dawson Contreras
        </a>
      </footer>
    </div>
  );
};

export default Home;
