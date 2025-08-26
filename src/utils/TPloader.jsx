// TypekitLoader.js
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const TypekitLoader = () => {
  useEffect(() => {
    (function(d) {
      var config = {
        kitId: 'zfs5vhh', // Replace with your actual kit ID
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,
      t=setTimeout(function(){
        h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";
      }, config.scriptTimeout),
      tk=d.createElement("script"),
      f=false,
      s=d.getElementsByTagName("script")[0],
      a;
      h.className+=" wf-loading";
      tk.src='https://use.typekit.net/' + config.kitId + '.js';
      tk.async=true;
      tk.onload=tk.onreadystatechange=function(){
        a=this.readyState;
        if (f || a && a !== "complete" && a !== "loaded") return;
        f=true;
        clearTimeout(t);
        try {
          if (window.Typekit) {
            window.Typekit.load(config);
          }
        } catch(e) {}
      };
      s.parentNode.insertBefore(tk, s);
    })(document);
  }, []);

  return (
    <Helmet>
      <html className="wf-loading" />
    </Helmet>
  );
};

export default TypekitLoader;
