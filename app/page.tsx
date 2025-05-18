import CreatePostFab from "./posts/create-post/create-post-fab";
import Posts from "./posts/posts";

export default async function Home() {
  return (
    <>
      <Posts />
      <CreatePostFab />
    </>
  );
}