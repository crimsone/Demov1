import React from "react"
import { Machine, assign, send } from 'xstate';
import axios from 'axios';
import guard from './guard/index.js';
import { setToken, isLoggedIn, axiosConfigLogin } from './../helpers/auth';
import { useRouter } from 'next/router'

const checkiflogin = async () => {
  try {
    if(await isLoggedIn())
    {
      return true
    } else {
      throw new Error('Wrong email or password.');
    }
  } catch (error) {
    throw new Error('Empty');
  }
}

const login = async (ctx, e) => {
  try {
    const { data } = await axios.post('http://api-demo.test/api/login',
      {
        email: ctx.email,
        password: ctx.password,
      }, axiosConfigLogin
    );
  
    if (data?.token){
      await setToken(data.token);
    }
    if (data?.status == 401) return (window.location.href = '/')
    return data
	} catch (err) {
    throw new Error('Wrong email or password.');
	}
};

const redirect = async () => {
	return (window.location.href = '/loader');
};

export const loginMachine = Machine({
  id: 'loginMachine',
  initial: 'isLogin',
  context: {
    email: '',
    password: '',
    error: '',
    success: '',
  },
  states: {
    isLogin: {
      invoke: {
        src: () => checkiflogin(),
        onDone: {
          target: 'redirect'
        },
        onError: {
          target: 'idle',
        }
      }
    },
    redirect: {
      invoke: {
        id: "redirect",
        src: redirect,
      },
    },
    idle: {
      on: {
        ENTER_EMAIL: [
          {
            actions: assign({
              email: (ctx, e) => e.value,
              emailCond: (ctx, e) => guard.emailReg.test(e.value),
              emailError: 'Invalid email',
            }),
          },
        ],
        ENTER_PASSWORD: [
          {
            actions: assign({
              password: (ctx, e) => e.value,
              passwordCond: (ctx, e) => guard.passwordReg.test(e.value),
              passwordError: 'Invalid password',
            })
          },
        ],
        SUBMIT: {
          target: 'submitting'
        }
      },
    },
    submitting: { 
      invoke: {
        id: 'loginRequest',
        src: (ctx, e) => login(ctx),
        onDone: {
          target: 'redirect',
          actions: assign({
            error: '',
            success: (ctx, e) => e.data.message,
          })
        },
        onError: {
          target: 'idle',
          actions: assign({
            success: '',
            error: (ctx, e) => e.data.message,
          })
        }
      }
    },
    success: {
      type: 'final'
    }
  }
},
{
  action: {
    changeEmail: assign({
      email: (ctx, e) => e.value,
    }),
    changePassword: assign({
      password: (ctx, e) => e.value,
    }),
    changeMessage: assign({
      message: (ctx, e) => e.value,
    }),
    setError: assign({
      error: (ctx, e) => e.data,
    }),
    clearError: assign({
      error: (ctx, e) => null,
    }),
  }
}
); 