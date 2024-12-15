import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "@/lib/store";
import { toast } from "react-toastify";


const url = process.env.NEXT_PUBLIC_BASE_URL;

// const token = sessionStorage.getItem("token") || null;

interface User {
    _id: string;
    name: string;
    email: string;
    country: string;
  }
interface Review {
    _id: string;
    skillId: string;
    user: User;
    rating: number;
    comments: string;
    reviewedBy: string; // Added field
}

interface ReviewState {
    data: Review[];
}

const initialState: ReviewState = {
    data: [],
};


const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        getReviews: (state, action) => {
            state.data = action.payload;
        },
        createReview: (state, action) => {
            state.data.push(action.payload);
        },
        updateReview: (state, action) => {
            const index = state.data.findIndex(
                (review) => review._id === action.payload._id
            );
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        },
        deleteReview: (state, action) => {
            state.data = state.data.filter((review) => review._id !== action.payload);
        },
    },
});

export const getReviews = () => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}/api/reviews`);
        const data = await res.json();

        if (res.status == 200) {
            dispatch(reviewSlice.actions.getReviews(data.data));
        }
    } catch (error) {
        toast.error("Failed to get reviews");
    }
}; 


export const getReviewsBySkillId = createAsyncThunk(
    'reviews/getReviewsBySkillId',
    async (skillId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${url}/api/reviews?skillId=${skillId}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch reviews');
            }
            return data.data; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const createReview = (reviewInfo: Review) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewInfo),
        });

        const data = await res.json();

        if (res.status == 201) { 
            dispatch(reviewSlice.actions.createReview(data.data));
            toast.success("Review created successfully");
        } else {
            toast.error("Failed to create review");
        }
    } catch (error) {
        console.error("Error creating review:", error);
        toast.error("Failed to create review");
    }
};

export const updateReview = (reviewInfo: Review) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}/api/reviews/${reviewInfo._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewInfo),
        });

        const data = await res.json();

        if (res.status == 200) {
            dispatch(reviewSlice.actions.updateReview(data.data));
            toast.success("Review updated successfully");
        }
    } catch (error) {
        toast.error("Failed to update review");
    }
};

export const deleteReview = (reviewId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}api/reviews/${reviewId}`, {
            method: "DELETE",
        });

        if (res.status == 200) {
            dispatch(reviewSlice.actions.deleteReview(reviewId));
            toast.success("Review deleted successfully");
        }
    } catch (error) {
        toast.error("Failed to delete review");
    }
};


export default reviewSlice.reducer;