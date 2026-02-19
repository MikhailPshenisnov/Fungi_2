import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GetCurrentUser, LogoutUser, type CurrentUserData } from '../api/AppApi.ts';

type AuthRequestStatus = 'idle' | 'loading';

export interface UserState {
    isLoggedIn: boolean;
    email: string;
    name: string;
    accessLvl: number;
    token: string;
    userId: string;
    isAuthChecked: boolean;
    authRequestStatus: AuthRequestStatus;
    currentUserRequestId: string | null;
}

const initialState: UserState = {
    isLoggedIn: false,
    email: "",
    name: "",
    accessLvl: -1,
    token: "",
    userId: "",
    isAuthChecked: false,
    authRequestStatus: 'idle',
    currentUserRequestId: null,
};

const clearUserState = (state: UserState) => {
    state.isLoggedIn = false;
    state.email = "";
    state.name = "";
    state.accessLvl = -1;
    state.token = "";
    state.userId = "";
};

const applyCurrentUserState = (state: UserState, payload: CurrentUserData | null) => {
    if (payload?.email) {
        state.isLoggedIn = true;
        state.email = payload.email;
        state.name = payload.name ?? "";
        state.accessLvl = payload.asseccLvl ?? -1;
        state.token = payload.token ?? "";
        state.userId = payload.userId ?? "";
        return;
    }

    clearUserState(state);
};

export const fetchCurrentUser = createAsyncThunk<CurrentUserData | null>(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetCurrentUser();
            return response.data.data ?? null;
        } catch (error: any) {
            if (error.response?.status === 401) {
                return null;
            }

            return rejectWithValue(error.message ?? 'Failed to fetch current user');
        }
    }
);

export const logoutCurrentUser = createAsyncThunk(
    'user/logoutCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            await LogoutUser();
        } catch (error: any) {
            return rejectWithValue(error.message ?? 'Failed to logout user');
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state, action) => {
                state.authRequestStatus = 'loading';
                state.currentUserRequestId = action.meta.requestId;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                if (state.currentUserRequestId !== action.meta.requestId) {
                    return;
                }

                state.currentUserRequestId = null;
                state.authRequestStatus = 'idle';
                state.isAuthChecked = true;
                applyCurrentUserState(state, action.payload);
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                if (state.currentUserRequestId !== action.meta.requestId) {
                    return;
                }

                state.currentUserRequestId = null;
                state.authRequestStatus = 'idle';
                state.isAuthChecked = true;
                clearUserState(state);
            })
            .addCase(logoutCurrentUser.pending, (state) => {
                // Ignore stale GetCurrentUser responses after logout.
                state.currentUserRequestId = null;
                state.authRequestStatus = 'loading';
            })
            .addCase(logoutCurrentUser.fulfilled, (state) => {
                clearUserState(state);
                state.authRequestStatus = 'idle';
                state.isAuthChecked = true;
            })
            .addCase(logoutCurrentUser.rejected, (state) => {
                clearUserState(state);
                state.authRequestStatus = 'idle';
                state.isAuthChecked = true;
            });
    }
});
