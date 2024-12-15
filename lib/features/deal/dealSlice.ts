import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Deal {
  _id: string;
  providerId: string;
  seekerId: string;
  timeFrame: string;
  skillsOffered: string;
  numberOfSessions: number;
  selectedAvailabilities: string[];
  status: string;
}

interface DealState {
  data: Deal[];
  currentDeal?: Deal | null;
  loading: boolean;
  error?: string | null;
}

const initialState: DealState = {
  data: [],
  currentDeal: null,
  loading: false,
};

// Fetch deals for a user
export const fetchDeals = createAsyncThunk<Deal[], string, { rejectValue: string }>(
  "deals/fetchDeals",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/api/deal/${userId}`);
      const data = await res.json();
      if (res.status === 200) {
        return data.data;
      } else {
        toast.error(data.error || "Failed to fetch deals");
        return rejectWithValue(data.error || "Failed to fetch deals");
      }
    } catch (error) {
      toast.error("Error fetching deals");
      return rejectWithValue(error.message || "Error fetching deals");
    }
  }
);

// Fetch a deal by ID
export const fetchDealById = createAsyncThunk<Deal, string, { rejectValue: string }>(
  "deals/fetchDealById",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/api/deal/${dealId}`);
      const data = await res.json();
      if (res.status === 200) {
        return data.data;
      } else {
        toast.error(data.error || "Failed to fetch deal");
        return rejectWithValue(data.error || "Failed to fetch deal");
      }
    } catch (error) {
      toast.error("Error fetching deal");
      return rejectWithValue(error.message || "Error fetching deal");
    }
  }
);

// Create a new deal
export const createDeal = createAsyncThunk<Deal, Partial<Deal>, { rejectValue: string }>(
  "deals/createDeal",
  async (dealData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/api/deal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealData),
      });
      const data = await res.json();
      if (res.status === 201) {
        toast.success("Deal created successfully");
        return data.data;
      } else {
        toast.error(data.error || "Failed to create deal");
        return rejectWithValue(data.error || "Failed to create deal");
      }
    } catch (error) {
      toast.error("Error creating deal");
      return rejectWithValue(error.message || "Error creating deal");
    }
  }
);

// Slice
const dealSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    clearCurrentDeal(state) {
      state.currentDeal = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealById.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload;
      })
      .addCase(fetchDealById.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createDeal.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDeal } = dealSlice.actions;

export default dealSlice.reducer;