(()=>{window.throttle=(a,d)=>{let m,t;return(...l)=>{!t||Date.now()-t>=d?(a(...l),t=Date.now()):(clearTimeout(m),m=setTimeout(()=>{a(...l),t=Date.now()},d-(Date.now()-t)))}};(function(){[Element,Document,Window].forEach(e=>{e.prototype._addEventListener=e.prototype.addEventListener,e.prototype._removeEventListener=e.prototype.removeEventListener,e.prototype.addEventListener=e.prototype.on=function(r,n,i){this.__listeners__=this.__listeners__||{},this.__listeners__[r]=this.__listeners__[r]||[];for(let[o,s]of this.__listeners__[r])if(o===n&&JSON.stringify(s)===JSON.stringify(i))return this;return this.__listeners__[r].push([n,i]),this._addEventListener(r,n,i),this},e.prototype.removeEventListener=e.prototype.off=function(r,n,i){return!this.__listeners__||!this.__listeners__[r]?this:n?(this._removeEventListener(r,n,i),this.__listeners__[r]=this.__listeners__[r].filter(([o,s])=>o!==n||JSON.stringify(s)!==JSON.stringify(i)),this.__listeners__[r].length===0&&delete this.__listeners__[r],this):(this.__listeners__[r].forEach(([o,s])=>{this.removeEventListener(r,o,s)}),delete this.__listeners__[r],this)}}),window._$=e=>document.querySelector(e),window._$$=e=>document.querySelectorAll(e);let a=window.matchMedia("(prefers-color-scheme: dark)").matches;function d(e){let n=e==="true"||e==="auto"&&a;n?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme"),localStorage.setItem("dark_mode",e),t&&(t.id=`nav-${e==="true"?"moon":e==="false"?"sun":"circle-half-stroke"}-btn`),document.body.dispatchEvent(new CustomEvent("reimu:theme-set",{detail:{isDark:n,mode:e}}))}let m=window.siteConfig?.dark_mode||{},t=null;m.button!==!1&&(t=document.createElement("a"),t.className="nav-icon dark-mode-btn",_$("#sub-nav")?.append(t),t.addEventListener("click",throttle(()=>{let e=["auto","false","true"],r=e[(e.indexOf(localStorage.getItem("dark_mode"))+1)%3];d(r)},1e3)));let l=localStorage.getItem("dark_mode")||document.documentElement.getAttribute("data-theme-mode")||"auto";d(l);let c=0;if(document.addEventListener("scroll",()=>{let e=document.documentElement.scrollTop||document.body.scrollTop,r=e-c;window.diffY=r,c=e,r<0?_$("#header-nav")?.classList.remove("header-nav-hidden"):_$("#header-nav")?.classList.add("header-nav-hidden")}),window.Pace&&Pace.on("done",()=>{Pace.sources[0].elements=[]}),window.materialTheme){let r=function(){if(_$("#reimu-generated-theme-style"))return;let s=`
    :root {
      --red-0: var(--md-sys-color-primary-light);
      --red-1: color-mix(in srgb, var(--md-sys-color-primary-light) 90%, white);
      --red-2: color-mix(in srgb, var(--md-sys-color-primary-light) 75%, white);
      --red-3: color-mix(in srgb, var(--md-sys-color-primary-light) 55%, white);
      --red-4: color-mix(in srgb, var(--md-sys-color-primary-light) 40%, white);
      --red-5: color-mix(in srgb, var(--md-sys-color-primary-light) 15%, white);
      --red-5-5: color-mix(in srgb, var(--md-sys-color-primary-light) 10%, white);
      --red-6: color-mix(in srgb, var(--md-sys-color-primary-light) 5%, white);
    
      --color-border: var(--red-3);
      --color-link: var(--red-1);
      --color-meta-shadow: var(--red-6);
      --color-h2-after: var(--red-1);
      --color-red-6-shadow: var(--red-2);
      --color-red-3-shadow: var(--red-3);
    }
    
    [data-theme="dark"]:root {
      --red-0: var(--red-1);
      --red-1: color-mix(in srgb, var(--md-sys-color-primary-dark) 90%, white);
      --red-2: color-mix(in srgb, var(--md-sys-color-primary-dark) 80%, white);
      --red-3: color-mix(in srgb, var(--md-sys-color-primary-dark) 75%, white);
      --red-4: color-mix(in srgb, var(--md-sys-color-primary-dark) 30%, transparent);
      --red-5: color-mix(in srgb, var(--md-sys-color-primary-dark) 20%, transparent);
      --red-5-5: color-mix(in srgb, var(--md-sys-color-primary-dark) 10%, transparent);
      --red-6: color-mix(in srgb, var(--md-sys-color-primary-dark) 5%, transparent);
      
      --color-border: var(--red-5);
    }
    `,h=document.createElement("style");h.id="reimu-generated-theme-style",h.textContent=s,document.body.appendChild(h)};var y=r;let e=new materialTheme.ColorThemeExtractor({needTransition:!1}),n=o=>{document.documentElement.style.setProperty("--md-sys-color-primary-light",e.hexFromArgb(o.schemes.light.props.primary)),document.documentElement.style.setProperty("--md-sys-color-primary-dark",e.hexFromArgb(o.schemes.dark.props.primary))};async function i(o){let s=await e.generateThemeSchemeFromImage(o);n(s),r()}window.generateSchemeHandler=()=>{if(window.bannerElement?.src)window.bannerElement.complete?i(bannerElement):window.bannerElement.addEventListener("load",()=>{i(bannerElement)},{once:!0});else if(window.bannerElement?.style.background){let o=window.bannerElement.style.background.match(/\d+/g),s=e.generateThemeScheme({r:parseInt(o[0]),g:parseInt(o[1]),b:parseInt(o[2])});n(s),r()}}}})();window.safeImport=async(a,d)=>{if(!d)return import(a);let t=await(await fetch(a)).text(),l=await crypto.subtle.digest("SHA-384",new TextEncoder().encode(t));if("sha384-"+btoa(String.fromCharCode(...new Uint8Array(l)))!==d)throw new Error(`Integrity check failed for ${a}`);let y=new Blob([t],{type:"application/javascript"}),e=URL.createObjectURL(y),r=await import(e);return URL.revokeObjectURL(e),r};})();
