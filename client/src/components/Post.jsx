/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/modal"; // Import the modal component

const Post = () => {
  const [specificPost, setSpecificPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  let { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:5501/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getSpecificPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5501/posts/byId/${id}`,
          {
            withCredentials: true,
          }
        );
        setSpecificPost(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5501/comments/${id}`,
          {
            withCredentials: true,
          }
        );
        setComments(response.data.comments);
      } catch (err) {
        console.log(err);
      }
    };

    getCurrentUser();
    getSpecificPost();
    getComment();
  }, [id]);

  const addComment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5501/comments",
        {
          commentBody: newComment,
          postId: id,
        },
        {
          withCredentials: true,
        }
      );
      const commentToAdd = {
        commentId: response.data.newComment.commentId,
        commentBody: newComment,
        username: response.data.newComment.username,
        userId: response.data.newComment.userId,
      };
      setComments([...comments, commentToAdd]);
      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5501/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments(
        comments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const updateComment = async (commentId, commentBody) => {
    try {
      const response = await axios.put(
        `http://localhost:5501/comments/${commentId}`,
        {
          commentBody,
        },
        {
          withCredentials: true,
        }
      );
      setComments(
        comments.map((comment) =>
          comment.commentId === commentId ? response.data.comment : comment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditComment = (comment) => {
    setCommentToEdit(comment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCommentToEdit(null);
  };

  const handleModalSubmit = (commentBody) => {
    updateComment(commentToEdit.commentId, commentBody);
    handleModalClose();
  };

  const formattedDate = new Date(specificPost.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }
  );

  return (
    <>
      <div className="ml-2 text-xl text-cyan-600">
        <button
          onClick={() => {
            navigate("/home");
          }}
        >
          back
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center p-5 ">
          <div className="flex flex-col w-96 bg-sky-500 p-5 rounded-md">
            <div className="flex items-center justify-between">
              <span>{specificPost.username}</span>
              <span>{formattedDate}</span>
            </div>

            <span>{specificPost.title}</span>
            <span>{specificPost.postDescription}</span>
            {specificPost.postContent ? (
              <img
                className="w-96 rounded-md"
                src={`http://localhost:5501/public/${specificPost.postContent}`}
                alt="Post Content"
              />
            ) : (
              <span />
            )}
            <span>
              {!specificPost.tags ? (
                <span></span>
              ) : (
                <span>tags: {specificPost.tags}</span>
              )}
            </span>
          </div>
        </div>
        <div className="">
          <div>
            {comments.length > 0 ? (
              comments.map((comment, key) => {
                const canEditOrDeleteComment =
                  currentUser &&
                  currentUser.sanitizedUser.id === comment.userId;
                const canDeleteComment =
                  currentUser &&
                  specificPost.userId === currentUser.sanitizedUser.id &&
                  specificPost.userId !== comment.userId;

                return (
                  <div className="bg-blue-600 m-2 p-2" key={key}>
                    <div className="flex justify-between items-center">
                      <label>{comment.username}</label>
                      {(canEditOrDeleteComment || canDeleteComment) && (
                        <div>
                          {canDeleteComment && (
                            <button
                              className="text-red-500"
                              onClick={() => deleteComment(comment.commentId)}
                            >
                              Delete
                            </button>
                          )}
                          {canEditOrDeleteComment && (
                            <>
                              <button
                                className="text-red-500"
                                onClick={() => deleteComment(comment.commentId)}
                              >
                                Delete
                              </button>
                              <button
                                className="text-yellow-500"
                                onClick={() => handleEditComment(comment)}
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-3xl">{comment.commentBody}</div>
                  </div>
                );
              })
            ) : (
              <p>No comments</p>
            )}
          </div>
          <div>
            <input
              type="text"
              value={newComment}
              placeholder="Comment..."
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
            />
            <button onClick={addComment} className="bg-blue-500">
              Add Comment
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialComment={commentToEdit ? commentToEdit.commentBody : ""}
      />
    </>
  );
};

export default Post;
