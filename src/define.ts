import { createApp } from "./app"

export function define(name: string, data: Function) {  
    customElements.define(name, class extends HTMLElement {
        data = data
      
        connectedCallback() {
          this.setAttribute('v-scope', "$el.data()")
          createApp().mount(this)
        }
      })
}