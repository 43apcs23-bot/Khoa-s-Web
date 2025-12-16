import * as api from '../../api/AuthenticationApi';
import { createAsyncThunk } from '@reduxjs/toolkit'
import { NotifyError, NotifySuccess, NotifyWarning } from '../../../toastify';

export const registeraUser = createAsyncThunk('User/registeraUser', async ({ authData, navigate, closeModal, closeModalDropDown }, { rejectWithValue }) => {
    try {
        const { data: { message } } = await api.registeraUser(authData);
        closeModal();
        window.innerWidth < 768 && closeModalDropDown();
        NotifySuccess(message);
        navigate("/");
        return;
    } catch (error) {
        if (error?.response?.status >= 300 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const loginaUser = createAsyncThunk('User/loginaUser', async ({ authData, navigate, closeModal, closeModalDropDown }, { rejectWithValue }) => {
    try {
        const { data: { message, token } } = await api.loginaUser(authData);
        // get cookie from server (for debug)
        const cookie = document.cookie;
        console.log(cookie, "cookie");
        closeModal();
        window.innerWidth < 768 && closeModalDropDown();
        if (token) {
            localStorage.setItem('authenticate', token);
        }
        NotifySuccess(message);
        navigate("/");
        return;
    } catch (error) {
        if (error?.response?.status >= 300 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const VerifyaUser = createAsyncThunk('User/VerifyUser', async ({ params, navigate, setMessage }, { rejectWithValue }) => {
    try {
        const { data: { message, token } } = await api.verifyUser(params);
        setMessage(message);
        if (token) {
            localStorage.setItem('authenticate', token)
        }
        NotifySuccess(message);
        setTimeout(() => {
            navigate('/');
        }, 3000);
        return;
    } catch (error) {
        if (error?.response?.status >= 300 && error?.response?.status <= 500) {
            setMessage(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            setMessage(error?.message || 'Đã có lỗi xảy ra')
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const logoutUser = createAsyncThunk('User/logoutUser', async ({ navigate }) => {
    try {
        const { data: { message } } = await api.logoutUser();
        NotifySuccess(message);
        localStorage.clear();
        navigate('/');
        return;
    } catch (error) {
        // If signout request fails (network or auth), still clear local state
        console.error('Logout request failed:', error);
        localStorage.clear();
        navigate('/');
        return;
    }
})
