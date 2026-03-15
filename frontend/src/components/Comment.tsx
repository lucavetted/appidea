import React, { useState, useEffect } from 'react';
import { commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Comment.css';

interface CommentProps {
  comment: any;
  onDelete: (id: number) => void;
  onReplyClick: (parentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onDelete, onReplyClick }) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (showReplies && replies.length === 0) {
      loadReplies();
    }
  }, [showReplies]);

  const loadReplies = async () => {
    try {
      const response = await commentService.getReplies(comment.id);
      setReplies(response.data);
    } catch (error) {
      console.error('Failed to load replies:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await commentService.updateComment(comment.id, editContent);
      setEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      await commentService.likeComment(comment.id);
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        {comment.avatar_url && (
          <img src={comment.avatar_url} alt={comment.username} className="comment-avatar" />
        )}
        <span className="comment-username">{comment.username}</span>
        <span className="comment-time">{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>

      {editing ? (
        <div className="comment-edit">
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          <div className="comment-edit-actions">
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}

      <div className="comment-actions">
        <button onClick={handleLike} className={`like-btn ${isLiked ? 'liked' : ''}`}>
          👍 {likes}
        </button>
        <button onClick={() => onReplyClick(comment.id)} className="reply-btn">
          Reply
        </button>
        {comment.reply_count > 0 && (
          <button onClick={() => setShowReplies(!showReplies)} className="replies-btn">
            {showReplies ? 'Hide' : 'Show'} {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
          </button>
        )}
        {user?.id === comment.user_id && (
          <>
            <button onClick={() => setEditing(true)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(comment.id)} className="delete-btn">Delete</button>
          </>
        )}
      </div>

      {showReplies && (
        <div className="replies">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
