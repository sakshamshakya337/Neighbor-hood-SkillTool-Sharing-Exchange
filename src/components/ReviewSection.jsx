import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ReviewSection = ({ toolId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/api/review/${toolId}`);
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toolId) {
      fetchReviews();
    }
  }, [toolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    if (rating === 0) {
      setSubmitMessage('Please select a star rating before submitting.');
      return;
    }
    try {
      await api.post('/api/review', { toolId, rating, comment });
      setSubmitMessage('Review submitted successfully!');
      setComment('');
      setRating(0);
      fetchReviews();
    } catch (err) {
      setSubmitMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/api/review/${reviewId}`);
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  const hasReviewed = user ? reviews.some(r => r.reviewer._id === user._id) : false;

  return (
    <div className="mt-8 border-t border-outline-variant pt-6">
      <h3 className="text-xl font-bold mb-4 font-headline text-primary">Reviews</h3>
      
      {error && <div className="text-error mb-4">{error}</div>}

      {/* Review List */}
      <div className="space-y-4 mb-8">
        {reviews.length === 0 ? (
          <p className="text-on-surface-variant">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-surface-container-low p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{review.reviewer?.name || 'Anonymous User'}</div>
                  <div className="text-xs text-on-surface-variant">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {user && review.reviewer && user._id === review.reviewer._id && (
                  <button onClick={() => handleDelete(review._id)} className="text-error text-sm hover:underline">
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-outline-variant'}`}
                  />
                ))}
              </div>
              <p className="text-on-surface">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Review Form */}
      {user ? (
        !hasReviewed ? (
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <h4 className="font-bold mb-4 font-headline">Write a Review</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-outline-variant'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-lg bg-surface border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  rows="3"
                  placeholder="Share your experience..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
              >
                Submit Review
              </button>
              {submitMessage && (
                <p className={`mt-2 text-sm ${submitMessage.includes('success') ? 'text-green-600' : 'text-error'}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        ) : (
          <p className="text-primary font-medium">You have already reviewed this tool.</p>
        )
      ) : (
        <p className="text-on-surface-variant">Please log in to write a review.</p>
      )}
    </div>
  );
};

export default ReviewSection;
