import { useAppDispatch, useAppSelector } from './hooks';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
  fetchComments,
  searchPosts
} from './slices/postsSlice';
import { useCallback } from 'react';

export const usePosts = () => {
  const dispatch = useAppDispatch();

  const posts = useAppSelector((state) => state.posts.items);
  const loading = useAppSelector((state) => state.posts.loading);
  const error = useAppSelector((state) => state.posts.error);
  const searchResults = useAppSelector((state) => state.posts.searchResults);

  const loadPosts = useCallback(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const createNewPost = useCallback(
    (data: { title: string; content: string, urlImg: string }) => {
      console.log("🚀 ~ pered dispatchem", data)
      return dispatch(createPost(data));
    },
    [dispatch]
  );

  const updateExistingPost = useCallback(
    (data: { id: number; title?: string; content?: string; urlImg?: string }) => {
      return dispatch(updatePost(data));
    },
    [dispatch]
  );

  const removePost = useCallback(
    (id: number) => {
      return dispatch(deletePost(id));
    },
    [dispatch]
  );

  const commentOnPost = useCallback(
    (data: { postId: number; username: string; email: string; homepage?: string; text: string; fileName?: string }) => {
      return dispatch(addComment(data));
    },
    [dispatch]
  );

  const loadComments = useCallback(
    (data: { postId: number }) => {
      return dispatch(fetchComments(data.postId));
    },
    [dispatch]
  );

  const performSearch = useCallback(
    (query: string) => {
      return dispatch(searchPosts(query)).unwrap();
    },
    [dispatch]
  );

  return {
    posts,
    loading,
    error,
    searchResults,
    loadPosts,
    createNewPost,
    updateExistingPost,
    removePost,
    commentOnPost,
    loadComments,
    performSearch,
  };
};
