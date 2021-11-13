import Axios from "axios";
import classnames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { mutate } from "swr";
import { useAuthState } from "../context/auth";
import { Post } from "../types";
import ActionButton from "./ActionButton";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  mutate?: Function;
}

export default function PostCard({
  post: {
    identifier,
    voteScore,
    subName,
    slug,
    title,
    body,
    createdAt,
    userVote,
    commentCount,
    url,
    username,
  },
  mutate,
}: PostCardProps) {
  const { authenticated } = useAuthState();
  const router = useRouter();

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === userVote) value = 0;

    try {
      const res = await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });

      if (mutate) mutate();

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={identifier}
      className="flex mb-4 rounded bg-white"
      id={identifier}
    >
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounder-l">
        {/* Upvote */}
        <div
          className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classnames("icon-arrow-up", {
              "text-red-500": userVote == 1,
            })}
          />
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* Downvote */}
        <div
          className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i
            className={classnames("icon-arrow-down", {
              "text-blue-600": userVote == -1,
            })}
          />
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
            ></img>
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold hover:underline cursor-pointer">
              /r/{subName}
            </a>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>

        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}

        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="fas fa-comment-alt fa-xs mr-1"></i>
                <span className="font-bold">{commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>

          <ActionButton>
            <i className="fas fa-share fa-xs mr-1"></i>
            <span className="font-bold">Share</span>
          </ActionButton>

          <ActionButton>
            <i className="fas fa-bookmark fa-xs mr-1"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
