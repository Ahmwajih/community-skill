
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

export const submitContactForm = createAsyncThunk(
  'contact/submitContactForm',
  async (formData: ContactFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/contact', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    formData: { fullName: '', email: '', message: '' } as ContactFormData,
    status: 'idle',
    error: null,
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.status = 'succeeded';
        state.formData = { fullName: '', email: '', message: '' };
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFormData } = contactSlice.actions;

export default contactSlice.reducer;