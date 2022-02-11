import { Machine, assign, send } from "xstate";
import axios from "axios";
import { logout, isLoggedIn, authUser, axiosConfig } from './../helpers/auth.js';

const checkiflogin = async () => {
  try {
    if(await isLoggedIn())
    {
      return true
    } else {
      window.location.href = "/loader";
      throw new Error('Wrong email or password.');
    }
  } catch (error) {
    window.location.href = "/";
    throw new Error('Empty');
  }
}

const products = async (context, event) => {
  try {
    const { data } = await axios.get('http://api-demo.test/api/products',axiosConfig);
    const user = await authUser()
    
    return {
      'products' : data.products,
      'user' : user
    }
	} catch (err) {
		throw new Error("ERROR GETTING OPTIONS");
	}
};

const addProduct = async (context, event) => {
  try {
    const { data } = await axios.post('http://api-demo.test/api/product-store',
      {
        name: context.productData.name,
        detail: context.productData.detail,
      },
      axiosConfig
    );
    return data;
	} catch (err) {
		throw new Error("ERROR GETTING OPTIONS");
	}
};

const deleteProduct= async (context, event) => {
  try {
    const { data } = await axios.post('http://api-demo.test/api/product-delete', 
      {
        id: event.id
      },
      axiosConfig
    );
    return data.result;
	} catch (err) {
		throw new Error("ERROR GETTING OPTIONS");
	}
};

const updateProduct = async (context, event) => {
  try {
    const { data } = await axios.post('http://api-demo.test/api/product-update',
      {
        id: context.id,
        name: context.name,
        detail: context.detail,
      },
      axiosConfig
    );
    return data.result;
	} catch (err) {
		throw new Error("ERROR GETTING OPTIONS");
	}
};

const onLogout = async () => {await logout()};
const auth = async () => {authUser()};

export const dashboardMachine = Machine({
  id: "dashboardMachine",
  initial: "checking",
  context: {
    data: undefined,
    user: '',
    openData: {
      id: undefined,
      name: "",
      detail: "",
    },
    productData: {
      name: "",
      detail: "",
    },
    error: undefined
  },
  states: {
    checking: {
      invoke: {
        id: "checkiflogged",
        src: checkiflogin,
        onDone: {
          target: "loading",
          actions: assign({
            data: (context, event) => event.data,
          }),
        },
        onError: {
          target: "fail",
          actions: assign({
            errors: (context, event) => event.data
          })
        }
      }
    },
    loading: {
      invoke: {
        id: "dataLoader",
        src: products,
        onDone: {
          target: "loaded",
          actions: assign(
            (context, event) => {
              context['data'] = event.data.products
              context['user'] = event.data.user
            },
          ),
        },
        onError: {
          target: "fail",
          actions: assign({
            errors: (context, event) => event.data
          })
        }
      }
    },
    loaded: { 
      on: {
        ENTER_NAME: [
          {actions: assign(
            (ctx, e) => ctx.productData['name'] = e.value
          )},
          {
            target: "fail",
          },
        ],
        ENTER_DETAIL: [
          {actions: assign(
            (ctx, e) => ctx.productData['detail'] = e.value
          )},
          {
            target: "fail",
          },
        ],
        SUBMIT: 'adding',
        REFRESH: 'loading',
        OPEN_EDIT: {
          target: 'editing',
          actions: assign({
            openData: (context, event) => event.value
          })
        },
        LOGOUT: {
          target: 'onlogout'
        },
        DELETE: {
          target: 'delete'
        },
        ADD: {
          target: 'add'
        }
      }
    },
    onlogout: {
      invoke: {
        src: onLogout
      }  
    },
    success: {
      on: {
        RETRY: 'loading'
      }
    },
    fail: { 
      on: { 
        RETRY: 'loading',
        SUBMIT: 'adding'
      } 
    },
    add: {
      invoke: {
        src: (context, event) => addProduct(context, event),
        onDone: {
          target: "loading",
          actions: assign(
            (ctx, e) => {
              ctx.productData['detail'] = ''
              ctx.productData['name'] = ''
            }
          )
        },
        onError: {
          target: "loading",
        }
      },
    },
    editing: {
      on: {
        EDIT_ID: [
          {actions: assign(
            (ctx, e) => ctx.openData['id'] = e.value
          )},
          {
            target: "fail",
          },
        ],
        EDIT_NAME: [
          {actions: assign(
            (ctx, e) => ctx.openData['name'] = e.value
          )},
          {
            target: "fail",
          },
        ],
        EDIT_DETAIL: [
          {actions: assign(
            (ctx, e) => ctx.openData['detail'] = e.value
          )},
          {
            target: "fail",
          },
        ],
        EDIT: {
          target: 'update'
        },
        BACK: {
          target: 'loading'
        },
      }
    },
    delete: {
      invoke: {
        src: (context, event) => deleteProduct(context, event),
        onDone: {
          target: "loading",
        },
        onError: {
          target: "fail",
        }
      },
    },
    update: {
      invoke: {
        src: (context, event) => updateProduct(context.openData),
        onDone: {
          target: "loading",
          actions: assign((ctx, e) => {
            ctx.openData['id'] = undefined
            ctx.openData['detail'] = ''
            ctx.openData['name'] = ''
          })
        },
        onError: {
          target: "loading",
          actions: assign({
            errors: (context, event) => event.data
          })
        }
      },
    },
    adding: {
      invoke: {
        src: (context, event) => addUser(context.userData),
        onDone: {
          target: "add",
          actions: assign(
            (context, event) => { 
              context.userData['first_name'] = "",
              context.userData['last_name'] = "",
              context.userData['password'] = "",
              context.userData['number'] = "",
              context.userData['email'] = "",
              context.userData['id'] = ""
            }
          )
        },
        onError: {
          target: "fail",
          actions: assign({
            errors: (context, event) => event.data
          })
        }
      }
    },
  }
}); 