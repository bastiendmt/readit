import { default as axios, default as Axios } from "axios";
import classnames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import ActionButton from "../../../../components/ActionButton";
import Sidebar from "../../../../components/Sidebar";
import { useAuthState } from "../../../../context/auth";
import { Comment, Post } from "../../../../types";

dayjs.extend(relativeTime);

export default function PostPage() {
  //Local state
  const [newComment, setNewComment] = useState("");
  //Global state
  const { authenticated, user } = useAuthState();

  //Utils
  const router = useRouter();
  const { identifier, slug, sub } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, mutate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  if (error) router.push("/");

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push("/login");

    // If vote is the same, reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      await Axios.post("/misc/vote", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });

      setNewComment("");
      mutate()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="rounded-full mr-2 overflow-hidden w-8 h-8">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  {/* Vote section */}
                  <div className="w-10 py-2 text-center bg-grey-200 rounder-l flex-shrink-0">
                    {/* Upvote */}
                    <div
                      className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classnames("icon-arrow-up", {
                          "text-red-500": post.userVote == 1,
                        })}
                      />
                    </div>
                    <p className="text-xs font-bold">{post.voteScore}</p>
                    {/* Downvote */}
                    <div
                      className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classnames("icon-arrow-down", {
                          "text-blue-600": post.userVote == -1,
                        })}
                      />
                    </div>
                  </div>
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post body */}
                    <p className="my-3 text-sm">{post.body}</p>
                    {/* Actions*/}
                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="fas fa-comment-alt fa-xs mr-1"></i>
                            <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
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
                {/* Comment input areat */}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                        <form onSubmit={submitComment}>
                          <textarea
                            className="w-full p-3 border-gray-300 border focus:outline-none rounded focus:border-gray-600"
                            onChange={(e) => setNewComment(e.target.value)}
                            value={newComment}
                          />
                          <div className="flex justify-end">
                            <button
                              className="px-3 py-1 blue button"
                              disabled={newComment.trim() === ""}
                            >
                              Comment
                            </button>
                          </div>
                        </form>
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center px-2 py-2 border border-gray-200 justify-between rounded">
                      <p className="text-gray-400 font-semibold text-sm">
                        Log in or sign up to leave a comment
                      </p>
                      <div>
                        <Link href={"/login"}>
                          <a className=" px-4 py-1 hollow blue mr-4 button">
                            Login
                          </a>
                        </Link>
                        <Link href={"/register"}>
                          <a className=" px-4 py-1 blue button">Register</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {/* Comments feed */}
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    {/* Vote section */}
                    <div className="w-10 py-2 text-center bg-grey-200 rounder-l flex-shrink-0">
                      {/* Upvote */}
                      <div
                        className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classnames("icon-arrow-up", {
                            "text-red-500": comment.userVote == 1,
                          })}
                        />
                      </div>
                      <p className="text-xs font-bold">{comment.voteScore}</p>
                      {/* Downvote */}
                      <div
                        className="w-6 mx-auto text-grey-400 rounder cursor hover:bg-gray-300 hover:text-blue-500"
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classnames("icon-arrow-down", {
                            "text-blue-600": comment.userVote == -1,
                          })}
                        />
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points • 
                            ${dayjs(comment.createdAt).fromNow()}
                           `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
