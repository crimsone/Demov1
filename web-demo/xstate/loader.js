import { Machine, assign, send } from 'xstate';
import { setToken, isLoggedIn } from './../helpers/auth';

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

const redirect = async () => {
	return (window.location.href = '/dashboard');
};

const loginRedirect = async () => {
	return (window.location.href = '/');
};

export const loaderMachine = Machine({
  id: 'loaderMachine',
  initial: 'loading',
  context: {
    email: '',
    password: '',
    error: '',
    success: '',
  },
  states: {
    loading: {
      invoke: {
        src: () => checkiflogin(),
        onDone: {
          target: 'redirect'
        },
        onError: {
          target: 'loginRedirect',
        }
      }
    },
    redirect: {
      invoke: {
        id: "redirect",
        src: redirect,
      },
    },
    loginRedirect: {
      invoke: {
        id: "loginRedirect",
        src: loginRedirect,
      },
    },
  }
}); 