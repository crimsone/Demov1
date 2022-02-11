import React from "react"
import { useMachine } from '@xstate/react';
import { loaderMachine } from './../../xstate/loader.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Loader() {
  const [ current, send ] = useMachine(loaderMachine, { devTools: true });

  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <FontAwesomeIcon icon="fa-spinner" spin size="6x"/>
    </div>
  )
}