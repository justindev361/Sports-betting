// @ts-nocheck

'use client'


import { useEffect, useState } from "react"

let timer;

export default function ConnectButton() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    timer = setInterval(() => {
      const button = document.querySelector("w3m-button").shadowRoot.querySelector("w3m-connect-button")?.shadowRoot.querySelector("wui-connect-button")?.shadowRoot.querySelector("button");
      const accountButton = document.querySelector("w3m-button").shadowRoot.querySelector("w3m-account-button")?.shadowRoot.querySelector("wui-account-button")?.shadowRoot.querySelector("button");
      if (button || accountButton) {
        if (button) {
          button.style.backgroundColor = '#333';
        }
        clearInterval(timer);
        setTimeout(() => setOpacity(1), 1000);
      }
    }, 1000);
  }, []);

  return (
    <w3m-button style={{ opacity }} />
  )
}