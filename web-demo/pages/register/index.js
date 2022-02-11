import React from "react";
import { useMachine } from '@xstate/react';
import { registerMachine } from './../../xstate/register.js';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Register() {
  const [ current, send ] = useMachine(registerMachine, { devTools: true });
  const data = current.context;
  const router = useRouter()

  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <div className="border-2 w-64 mx-auto my-auto shadow-md rounded-md">
        <div className="m-4 text-center">
          <p className=""><small className="font-bold text-red-500">DEMO</small><small className="font-bold">v1</small> <small>Login</small></p>
          <p className="text-xs capitalize antialiased">{process.env.environment}</p>
          <p className="font-semibold capitalize mt-2">Registration</p>
        </div>
        <div className="m-4">
          <div className="">
            <p className="text-sm font-semibold">
              Name
              {(data.name && data.nameCond == false) ?
                <span className="px-1 text-xs text-red-600">
                  Invalid name
                </span>
                : ""
              }
            </p> 
            <input 
              type="name" 
              autoComplete="off" 
              id="name" 
              name="name" 
              value={data.name} 
              className="border w-full rounded px-2" 
              onChange={
                e => send({
                  type: "ENTER_NAME",
                  value: e.target.value
                })
              }  
            />
          </div>
          <div className="">
            <p className="text-sm font-semibold">
              Email
              {(data.email && data.emailCond == false) ?
                <span className="px-1 text-xs text-red-600">
                  Invalid Email
                </span>
                : ""
              }
            </p> 
            <input 
              type="email" 
              autoComplete="off" 
              id="email" 
              name="email" 
              value={data.email} 
              className="border w-full rounded px-2" 
              onChange={
                e => send({
                  type: "ENTER_EMAIL",
                  value: e.target.value
                })
              }  
            />
          </div>
          <div className="">
            <p className="text-sm font-semibold">
              Password
              {(data.password && data.passwordCond == false) ?
                <span className="px-1 text-xs text-red-600">
                  Invalid Password
                </span>
                : ""
              }
            </p>
            <input 
              type="password" 
              autoComplete="off" 
              id="password" 
              name="password" 
              value={data.password} 
              className="border w-full rounded px-2" 
              onChange={
                e => send({
                  type: "ENTER_PASSWORD",
                  value: e.target.value
                })
              }  
            />
          </div>
          <div className="">
            <p className="text-sm font-semibold">
              Confirm Password
              {(data.confirmPassword == data.password) ?
                ""
                : 
                <span className="px-1 text-xs text-red-600">
                  Invalid Password
                </span>
              }
            </p>
            <input 
              type="password" 
              autoComplete="off" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={data.confirmPassword} 
              className="border w-full rounded px-2" 
              onChange={
                e => send({
                  type: "ENTER_CONFIRMPASSWORD",
                  value: e.target.value
                })
              }  
            />
          </div>
          <div className="mt-4">
            <button 
              className="bg-slate-900 hover:bg-slate-700 w-full rounded p-1 text-white uppercase text-sm font-semibold tracking-widest" 
              onClick={() => send("SUBMIT")}
              disabled={current.matches('submitting') ? true : false}
            >
              {(current.matches('submitting')) && (<FontAwesomeIcon icon="fa-spinner" spin />)}
              {(current.matches('idle')) && ('Submit')}
            </button>
            <button 
              className="border border-slate-900 hover:bg-slate-700 w-full rounded p-1 text-slate hover:text-white uppercase text-sm font-semibold tracking-widest mt-1" 
              onClick={() => router.push('/')}
            >Back</button>
          </div>
        </div>
      </div>
    </div>
  )
}