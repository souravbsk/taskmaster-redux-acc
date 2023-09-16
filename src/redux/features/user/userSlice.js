import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import auth from "../../../utils/firebase.config";

const initialState = {
  name: "",
  email: "",
  isLoading: true,
  isError: false,
  error: "",
};


//sign up with email and password
export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ email, password,name }) => {
    console.log(email,password);
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser,{
      displayName:name,
    })
    console.log(data);
    return {
      email: data.user.email,
      name: data.user.displayName
    };
  }
);
export const signInUser = createAsyncThunk(
  "userSlice/signInUser",
  async ({ email, password }) => {
    console.log(email,password);
    const data = await signInWithEmailAndPassword(auth, email, password);
    return {
      email: data.user.email,
      name: data.user.displayName
    };
  }
);


export const signInWithGoogle = createAsyncThunk("userSlice/signInWithGoogle", async () => {
  const googleProvider = new GoogleAuthProvider();
  const data = await signInWithPopup(auth,googleProvider)
  console.log(data);
  return {
    email: data.user.email,
    name:data.user.displayName,
  }
})

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser:(state,{payload}) => {
      state.name=payload.name;
      state.email = payload.email;
    },
    toggleLoading:(state,{payload}) => {
      state.isLoading = payload
    },
    logOut:(state) => {
      state.email = "";
      state.name = ""
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.email = "";
        state.name = "";
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.email = payload.email;
        state.name = payload.name;
        state.error = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.email = "";
        state.name = "";
        state.error = action?.error?.message;
      });

      // sign in with email and password
      builder
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.email = "";
        state.name = "";
        state.error = "";
      })
      .addCase(signInUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.email = payload.email;
        state.name = payload.name;
        state.error = "";
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.email = "";
        state.name = "";
        state.error = action?.error?.message;
      });


      //for google sign in
      builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.email = "";
        state.name = "";
        state.error = "";
      })
      .addCase(signInWithGoogle.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.email = payload.email;
        state.name = payload.name;
        state.error = "";
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.email = "";
        state.name = "";
        state.error = action?.error?.message;
      });


  },
});

export const {setUser,toggleLoading,logOut} = userSlice.actions;

export default userSlice.reducer;
