import React from "react";
import Link from "next/link";
import { Post } from "../types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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

export default function PostCard({ post }) {
  return (
    <div key={post.identifier} className="flex mb-4 rounded bg-white">
      {/* Vote section */}
      <div className="w-10 text-center bg-grey-200 rounder-l">
        <p>V</p>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${post.subName}`}>
            <>
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
              ></img>
              <a className="text-xs font-bold hover:underline cursor-pointer">
                /r/{post.subName}
              </a>
            </>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">/u/{post.username}</a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>

        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm">{post.body}</p>}

        <div className="flex">
          <Link href={post.url}>
            <a>
              <ActionButton>
                <i className="fas fa-comment-alt fa-xs mr-1"></i>
                <span className="font-bold">20 Comments</span>
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
