import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const subscribeNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email: string) => {
    try {
      // const response = await axios.post('/api/newsletter', { email });
      const res = await fetch(`${baseUrl}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
      const data = await res.json();
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  }
);

// export const addSkillToUser = createAsyncThunk(
//   'skills/addSkillToUser',
//   async (skillData: Partial<Skill>, { dispatch }) => {
//     try {
//       const res = await fetch(`${baseUrl}api/skills`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(skillData),
//       });

//       const data = await res.json();

//       if (res.status === 201) {
//         dispatch(createSkill(data.data));
//         toast.success("Skill added successfully");
//         console.log("Skill added successfully");
//       } else {
//         toast.error("Failed to add skill");
//       }
//     } catch (error) {
//       toast.error("Error adding skill");
//     }
//   }
// );

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: {
    email: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    // createNewsletter: (state, action) => {
    //   state.email = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.email = action.payload;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// export const { createNewsletter } = newsletterSlice.actions;

export default newsletterSlice.reducer;
