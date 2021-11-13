import Axios from "axios";
import classnames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import { useAuthState } from "../../context/auth";
import { Sub } from "../../types";

export default function SubPage() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);

  //Global state
  const { user, authenticated } = useAuthState();

  // Utils
  const router = useRouter();
  const subName = router.query.sub;
  const fileInputRef = createRef<HTMLInputElement>();

  const {
    data: sub,
    error,
    mutate,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub) return;

    console.log(authenticated && user.username === sub.username);
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  if (error) {
    router.push("/");
  }

  let postsMarkup;

  if (!sub) {
    postsMarkup = <p className="tex-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = <p className="tex-lg text-center">No posts submitted yet</p>;
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} mutate={mutate}/>
    ));
  }

  const onpenFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>

      {sub && (
        <>
          <input type="file" hidden ref={fileInputRef} onChange={uploadImage} />
          {/* Sub info & images */}
          <div>
            {/* Banner Image */}
            <div
              className={classnames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => onpenFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <Image
                  className="h-56 bg-blue-500"
                  src={sub.bannerUrl}
                  alt="banner"
                  height={100}
                  width={700}
                  layout="responsive"
                />
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub meta data */}
            <div className="h-20 bg-white">
              <div className="container flex relative">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    className={classnames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    onClick={() => onpenFileInput("image")}
                    width={70}
                    height={70}
                  />
                </div>

                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Posts & Sidebar */}
          <div className="container flex pt-5">
            <div className="w-full md:w-160">{postsMarkup}</div>
            <Sidebar sub={sub}/>
          </div>
        </>
      )}
    </div>
  );
}
