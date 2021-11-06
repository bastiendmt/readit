import  Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function PostPage() {
  const router = useRouter();
  const { identifier, slug, sub } = router.query;

  const { data: post, error } = useSWR(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  if (error) router.push("/");

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
    </>
  );
}
