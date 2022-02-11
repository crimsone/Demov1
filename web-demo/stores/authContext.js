import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  user: null,
  login: (email, password) => { 
    console.log('Login', email, password) 
  },
  logout: () => { console.log('Logout') },
  authReady: false
})

export default AuthContext