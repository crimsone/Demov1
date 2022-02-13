import React, { useState } from "react";
import { useMachine } from '@xstate/react';
import { dashboardMachine } from '../../xstate/dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Dashboard() {
  const [ current, send ] = useMachine(dashboardMachine, { devTools: true });
  const { data, productData, openData, user } = current.context;

  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <div className="border-2 w-3/5 mx-auto my-auto shadow-md rounded-md p-2">
        <div className="flex w-full">
          <p className="flex-auto">Dashboard</p>
          <p className="">
            <button 
              className="rounded m-1 px-1 bg-red-500 text-white"
              onClick={() => send("LOGOUT")}
            >
              Logout
            </button>
          </p>
        </div>

        {/* User */}
        <div className="flex my-2 mx-2">
          <p className="text-sm mr-1 font-semibold text-slate-500">Hello,</p>
          <p className="text-sm mr-1 font-bold text-slate-700">{user.name}</p>
        </div>

        {/* State management */}
        <div className="flex my-2 mx-2">
          <p className="text-xs mr-1 font-semibold text-slate-400">State:</p>
          <p className="text-xs capitalize font-bold text-blue-800">{ current.value }</p>
        </div>

        {/* Add */}
        {["loaded","add"].some(current.matches) &&
          (<div className="flex my-4 border-2 p-2 rounded-md">
            <div className="ml-2">
              <label htmlFor="name" className="text-sm">Name</label>
              <input 
                id="name" 
                type="text" 
                className=" bg-slate-100 mx-2 px-2 rounded focus:bg-slate-300" 
                value={ productData.name }
                onChange={
                  e => send({
                    type: "ENTER_NAME",
                    value: e.target.value
                  })
                }  
              />
            </div>
            <div className="ml-2">
              <label htmlFor="detail" className="text-sm">Detail</label>
              <input 
                id="detail" 
                type="text" 
                className=" bg-slate-100 mx-2 px-2 rounded focus:bg-slate-300"
                value={ productData.detail }
                onChange={
                  e => send({
                    type: "ENTER_DETAIL",
                    value: e.target.value
                  })
                }   
              />
            </div>
            <div>
              <button 
                className="bg-blue-500 text-white px-2 rounded-md"
                onClick={() => send('ADD')}
              >
                {["loading","add"].some(current.matches) && (<FontAwesomeIcon icon="fa-spinner" spin />)}
                {(current.matches('loaded')) && ('Add')}
              </button>
            </div>
          </div>
        )}

        {/* Edit */}
        {['editing','update'].some(current.matches) &&
          (<div className="flex my-4 border-2 p-2 rounded-md">
            <div className="ml-2">
            <input 
                id="id" 
                type="number" 
                value={ openData.id }
                onChange={
                  e => send({
                    type: "EDIT_ID",
                    value: e.target.value
                  })
                }  
                readOnly
                hidden
              />
              <label htmlFor="name" className="text-sm">Name</label>
              <input 
                id="name" 
                type="text" 
                className=" bg-slate-100 mx-2 px-2 rounded focus:bg-slate-300" 
                value={ openData.name }
                onChange={
                  e => send({
                    type: "EDIT_NAME",
                    value: e.target.value
                  })
                }  
              />
            </div>
            <div className="ml-2">
              <label htmlFor="detail" className="text-sm">Detail</label>
              <input 
                id="detail" 
                type="text" 
                className=" bg-slate-100 mx-2 px-2 rounded focus:bg-slate-300"
                value={ openData.detail }
                onChange={
                  e => send({
                    type: "EDIT_DETAIL",
                    value: e.target.value
                  })
                }   
              />
            </div>
            <div>
              <button 
                className="bg-green-500 text-white px-2 rounded-md mr-2"
                onClick={() => send('EDIT')}
              >
                {["loading","edit","update"].some(current.matches) && (<FontAwesomeIcon icon="fa-spinner" spin />)}
                {["loaded","editing"].some(current.matches) && ('Update')}
              </button>
              <button 
                className="bg-red-500 text-white px-2 rounded-md"
                onClick={() => send('BACK')}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Products */}
        {["loaded","loading","delete"].some(current.matches) &&
          (<div className="my-2">
            <p className="text-slate-500 text-sm">Products</p>
            <div className="border-t-2 border-slate-200">
              {["loaded"].some(current.matches) &&
                (data.map((product, idx) => (
                  <div key={idx} className="bg-slate-100 m-2 px-2 py-2 flex">
                    <div className="w-2/4 flex">
                      <div className="border-r-2 pr-1 border-slate-300">
                        {product.id}
                      </div>
                      <div className="flex-col mx-2">
                        <p className="font-semibold bg-slate-100">{product.name}</p>
                        <p className="text-xs bg-slate-100">{product.detail}</p>
                      </div>
                    </div>
                    <div className="w-2/4 text-right">
                      <button 
                        className="rounded m-1 p-1 bg-red-500 text-white" 
                        onClick={() => send({
                          type: 'DELETE',
                          id: product.id
                        })}
                      >Delete</button>
                      <button 
                        className="rounded m-1 p-1 bg-green-500 text-white"
                        onClick={() => send({
                          type: 'OPEN_EDIT',
                          value: product
                        })}
                      >Update</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}