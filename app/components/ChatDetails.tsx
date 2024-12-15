'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeals } from '@/lib/features/deal/dealSlice';
import { RootState } from '@/lib/store';

const ChatDetails = ({ conversation, dealId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDeals(user.id)).then((action) => {
        if (action.payload) {
          setDeals(action.payload);
        } else if (action.error) {
          console.error("Failed to fetch deals:", action.error);
        }
      });
    }
  }, [user, dispatch]);

  const deal = deals.find((d) => d._id === dealId);

  if (!conversation) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-white border-t border-gray overflow-y-auto">
      <h2 className="mb-4 text-lg font-bold text-orange">Deal Details</h2>
      <p>
        <strong className="text-brown">Provider:</strong> {conversation.providerId?.name || 'N/A'}
      </p>
      <p>
        <strong className="text-brown">Seeker:</strong> {conversation.seekerId?.name || 'N/A'}
      </p>
    </div>
  );
};

export default ChatDetails;
