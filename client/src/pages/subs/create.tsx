import Axios from "axios";
import classnames from "classnames";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

export default function CreateSub() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Partial<any>>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await Axios.post(`/subs`, {
        name,
        title,
        description,
      });

      router.push(`/r/${res.data.name}`);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="h-screen bg-cover w-36"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />
      <div className="flex flex-col justify-center pl-6">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
          <hr />
          <form onSubmit={submitForm}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="text-xs text-gray-500 mb-2">
                Community names including capitalization cannot be changed.
              </p>
              <input
                type="text"
                className={classnames(
                  "w-full border boder-gray-200 rounded p-3 hover:border-gray-500",
                  { "border-red-600": errors.name }
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className="text-red-600 font-mideium">{errors.name}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="text-xs text-gray-500 mb-2">
                Community title represent the topic. You can change it later.
              </p>
              <input
                type="text"
                className={classnames(
                  "w-full border boder-gray-200 rounded p-3 hover:border-gray-500",
                  { "border-red-600": errors.title }
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className="text-red-600 font-mideium">
                {errors.title}
              </small>
            </div>
            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="text-xs text-gray-500 mb-2">
                This is how new members come to understand your community.
              </p>
              <textarea
                className="w-full border boder-gray-200 rounded p-3 hover:border-gray-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <small className="text-red-600 font-mideium">
                {errors.desription}
              </small>
            </div>
            <div className="flex justify-end">
              <button className="blue button px-4 py-1 capitalize text-sm font-semibold">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");

    await Axios.get("/auth/me", { headers: { cookie } });

    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: "/login" });
    res.end();
  }
};
