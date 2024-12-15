import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    "Machine Learning",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "AI Development",
    "Graphic Design",
  ],
  selectedCategory: "", 
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
