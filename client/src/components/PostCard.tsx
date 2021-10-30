import React from "react";
import Link from "next/link";
import { Post } from "../types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Axios from "axios";

interface PostCardProps {
  post: Post;
}

const ActionButton = ({ children }) => {
  return (
    <div className="text-gray-400 px-1 py-1 mr-1 rounded cursor-pointer hover:bg-gray-200 text-xs">
      {children}
    </div>
  );
};

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
}: PostCardProps) {
  const vote = async (value) => {
    try {
      const res = await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div key={identifier} className="flex mb-4 rounded bg-white">
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-grey-200 rounder-l">
        {/* Upvote */}
        <div
          className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i className="icon-arrow-up"></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* Downvote */}
        <div
          className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i className="icon-arrow-down"></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <>
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
              ></img>
              <a className="text-xs font-bold hover:underline cursor-pointer">
                /r/{subName}
              </a>
            </>
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
