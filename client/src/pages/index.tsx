import Head from "next/head";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Post } from "../types";
import Link from "next/link";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GetServerSideProps } from "next";
import PostCard from "../components/PostCard";

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    Axios.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>Readit: the front page of the internet</title>
      </Head>

      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier}/>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}

// SSR
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get("/posts");

//     return { props: { posts: res.data } };
//   } catch (err) {
//     return { props: { error: "Something went wrong" } };
//   }
// };
