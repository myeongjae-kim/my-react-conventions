import React from 'react'
import { Post } from '../../domain/model/Post'

interface Props {
  posts: Post[]
}

const Posts: React.FC<Props> = ({posts}) => (
  <ul>
    {posts.map((post) =>
      <li key={post.title}>{post.title}</li>
    )}
  </ul>
)

export default Posts
