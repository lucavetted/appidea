import React, { useState, useEffect } from 'react';
import { commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Comment from './Comment';
import '../styles/CommentSection.css';

interface CommentSectionProps {
  photoId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ photoId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [photoId]);

  const loadComments = async () => {
    try {
      const response = await commentService.getComments(photoId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
    setLoading(false);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      await commentService.createComment(photoId, newComment);
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleReplySubmit = async (parentCommentId: number) => {
    if (!replyContent.trim() || !isAuthenticated) return;

    try {
      await commentService.createComment(photoId, replyContent, parentCommentId);
      setReplyContent('');
      setReplyingTo(null);
      loadComments();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>

      {isAuthenticated ? (
        <div className="comment-input-form">
          <textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <button onClick={handleCommentSubmit} className="submit-comment-btn">
            Post Comment
          </button>
        </div>
      ) : (
        <p className="login-prompt">Log in to comment</p>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id}>
            <Comment
              comment={comment}
              onDelete={handleDeleteComment}
              onReplyClick={setReplyingTo}
            />

            {replyingTo === comment.id && isAuthenticated && (
              <div className="reply-form">
                <textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                />
                <div className="reply-form-actions">
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    className="reply-submit-btn"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="reply-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
