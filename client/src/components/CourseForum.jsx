import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

const ForumContainer = styled.div`
  margin: 2rem 0;
`;

const ForumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    color: var(--primary-color);
  }
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PostCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.$pinned ? 'rgba(26, 26, 64, 0.05)' : 'transparent'};
  border-bottom: 1px solid var(--light-gray);
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const AuthorInfo = styled.div`
  h4 {
    margin-bottom: 0.2rem;
    font-size: 1rem;
  }
  
  span {
    font-size: 0.8rem;
    color: var(--dark-gray);
  }
`;

const PostDate = styled.div`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

const PostContent = styled.div`
  padding: 1.5rem;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
  
  p {
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--dark-gray);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: var(--primary-color);
  }
  
  ${props => props.$active && `
    color: var(--primary-color);
    font-weight: 600;
  `}
`;

const CommentsList = styled.div`
  border-top: 1px solid var(--light-gray);
  padding: 1.5rem;
  background-color: var(--light-gray);
  display: ${props => props.$show ? 'block' : 'none'};
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
  
  .author {
    font-weight: 600;
    margin-bottom: 0.3rem;
  }
  
  .text {
    margin-bottom: 0.5rem;
  }
  
  .date {
    font-size: 0.8rem;
    color: var(--dark-gray);
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const NewPostForm = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  // If less than a day, show relative time
  if (diff < 86400000) { // 24 hours in milliseconds
    if (diff < 3600000) { // 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
  } else if (diff < 604800000) { // 7 days
    const days = Math.floor(diff / 86400000);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

const CourseForum = ({ courseId, isEnrolled = false }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      // In a real app, this would be an API call to get forum posts
      // For demo, we'll use mock data
      setLoading(true);

      setTimeout(() => {
        setPosts([
          {
            id: 1,
            title: 'Understanding Market Research Methods',
            content: 'I\'m struggling to determine which market research methods would be most effective for my startup. Has anyone had success with a particular approach?',
            author: {
              id: 101,
              name: 'Alex Morgan',
              role: 'Student'
            },
            date: '2023-11-25T14:30:00Z',
            likes: 12,
            pinned: true,
            comments: [
              {
                id: 201,
                author: {
                  id: 102,
                  name: 'Sarah Johnson',
                  role: 'Instructor'
                },
                content: 'For early-stage startups, I recommend starting with customer interviews. They provide deep insights without requiring much investment.',
                date: '2023-11-25T15:45:00Z'
              },
              {
                id: 202,
                author: {
                  id: 103,
                  name: 'Michael Chen',
                  role: 'Student'
                },
                content: 'I had great success with online surveys combined with user testing. It gave me both quantitative and qualitative data.',
                date: '2023-11-26T09:15:00Z'
              }
            ]
          },
          {
            id: 2,
            title: 'Funding Options for SaaS Startups',
            content: 'I\'m exploring funding options for my SaaS startup. Would appreciate any insights on whether VC funding or bootstrapping would be more appropriate at this stage.',
            author: {
              id: 104,
              name: 'Jamie Lewis',
              role: 'Student'
            },
            date: '2023-11-27T10:20:00Z',
            likes: 8,
            pinned: false,
            comments: []
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchPosts();
  }, [courseId]);

  const handleToggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();

    if (!commentInputs[postId]?.trim()) return;

    // In a real app, this would be an API call to add a comment
    const newComment = {
      id: Math.floor(Math.random() * 1000) + 300, // Just for demo
      author: {
        id: user.id,
        name: user.name,
        role: 'Student'
      },
      content: commentInputs[postId],
      date: new Date().toISOString()
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    // Clear input
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) return;

    // In a real app, this would be an API call to create a post
    const post = {
      id: Math.floor(Math.random() * 1000) + 10, // Just for demo
      title: newPost.title,
      content: newPost.content,
      author: {
        id: user.id,
        name: user.name,
        role: 'Student'
      },
      date: new Date().toISOString(),
      likes: 0,
      pinned: false,
      comments: []
    };

    setPosts(prevPosts => [post, ...prevPosts]);
    setNewPost({ title: '', content: '' });
    setShowNewPostForm(false);
  };

  const handleLikePost = (postId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  if (!user || !isEnrolled) {
    return (
      <ForumContainer>
        <ForumHeader>
          <h3>Course Discussion Forum</h3>
        </ForumHeader>
        <div style={{
          background: 'var(--light-gray)',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '8px'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            {!user
              ? 'You need to sign in to access the discussion forum.'
              : 'You need to enroll in this course to participate in discussions.'}
          </p>
          <Button
            as="a"
            href={!user ? '/login' : `/course/${courseId}`}
            primary
          >
            {!user ? 'Sign In' : 'Enroll Now'}
          </Button>
        </div>
      </ForumContainer>
    );
  }

  return (
    <ForumContainer>
      <ForumHeader>
        <h3>Course Discussion Forum</h3>
        <Button
          primary={!showNewPostForm}
          secondary={showNewPostForm}
          onClick={() => setShowNewPostForm(!showNewPostForm)}
        >
          {showNewPostForm ? 'Cancel Post' : 'New Discussion'}
        </Button>
      </ForumHeader>

      {showNewPostForm && (
        <NewPostForm>
          <form onSubmit={handleNewPostSubmit}>
            <FormGroup>
              <label htmlFor="title">Discussion Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPost.title}
                onChange={handleNewPostChange}
                placeholder="Enter a clear, concise title for your discussion"
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="content">Your Question or Discussion Topic</label>
              <textarea
                id="content"
                name="content"
                value={newPost.content}
                onChange={handleNewPostChange}
                placeholder="Share your question or thoughts in detail"
                required
              />
            </FormGroup>

            <Button type="submit" primary>Post Discussion</Button>
          </form>
        </NewPostForm>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading discussions...
        </div>
      ) : posts.length === 0 ? (
        <div style={{
          background: 'var(--light-gray)',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '8px'
        }}>
          <p>No discussions yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <PostsList>
          {posts.map(post => (
            <PostCard key={post.id}>
              <PostHeader $pinned={post.pinned}>
                <PostAuthor>
                  <AuthorAvatar>{getInitials(post.author.name)}</AuthorAvatar>
                  <AuthorInfo>
                    <h4>{post.author.name}</h4>
                    <span>{post.author.role}</span>
                  </AuthorInfo>
                </PostAuthor>
                <PostDate>{formatDate(post.date)}</PostDate>
              </PostHeader>

              <PostContent>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </PostContent>

              <PostActions>
                <ActionButton onClick={() => handleLikePost(post.id)}>
                  👍 {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                </ActionButton>
                <ActionButton
                  onClick={() => handleToggleComments(post.id)}
                  $active={expandedComments[post.id]}
                >
                  💬 {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                </ActionButton>
              </PostActions>

              <CommentsList $show={expandedComments[post.id]}>
                {post.comments.length === 0 ? (
                  <p style={{ marginBottom: '1rem', color: 'var(--dark-gray)' }}>
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  post.comments.map(comment => (
                    <CommentItem key={comment.id}>
                      <CommentAvatar>{getInitials(comment.author.name)}</CommentAvatar>
                      <CommentContent>
                        <div className="author">{comment.author.name}</div>
                        <div className="text">{comment.content}</div>
                        <div className="date">{formatDate(comment.date)}</div>
                      </CommentContent>
                    </CommentItem>
                  ))
                )}

                <CommentForm onSubmit={(e) => handleCommentSubmit(post.id, e)}>
                  <CommentInput
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  />
                  <Button type="submit" primary small>Post</Button>
                </CommentForm>
              </CommentsList>
            </PostCard>
          ))}
        </PostsList>
      )}
    </ForumContainer>
  );
};

export default CourseForum;
