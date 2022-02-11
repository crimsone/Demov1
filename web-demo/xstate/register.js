import React from "react"
import { Machine, assign, send } from 'xstate';
import axios from 'axios';
import guard from './guard/index.js';
import { setToken, isLoggedIn } from './../helpers/auth';
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

const register = async (ctx, e) => {
  try {
    const { data } = await axios.post('http://api-demo.test/api/register',
      {
        name: ctx.name,
        email: ctx.email,
        password: ctx.password,
      }
    );

    return data
	} catch (err) {
    throw new Error('Wrong email or password.');
	}
};

const redirect = async () => {
	return (window.location.href = '/');
};

export const registerMachine = Machine({
  id: 'registerMachine',
  initial: 'idle',
  context: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    success: '',
  },
  states: {
    idle: {
      on: {
        ENTER_NAME: [
          {
            actions: assign({
              name: (ctx, e) => e.value,
              nameError: 'Invalid name',
            }),
          },
        ],
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
        ENTER_CONFIRMPASSWORD: [
          {
            actions: assign({
              confirmPassword: (ctx, e) => e.value,
              confirmPasswordCond: (ctx, e) => guard.passwordReg.test(e.value),
              confirmPasswordError: 'Invalid password',
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
        id: 'registerRequest',
        src: (ctx, e) => register(ctx),
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
    },
    redirect: {
      invoke: {
        id: "redirect",
        src: redirect,
      },
    },
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