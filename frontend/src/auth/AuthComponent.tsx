import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useState, useEffect } from "react";

function AuthComponent() {
  const [_user, setUser] = useState({})

  useEffect(()=>{
    async function getUserData(){
      await supabase.auth.getUser().then((value)=>{
        if(value?.data?.user){
          setUser(value?.data?.user);
        }
      })
    }
    getUserData();
  }, )
  return (
    <div className="flex">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa, style: {
          container: { fontFamily: "Inter, sans-serif" },
          button: { fontFamily: "Inter, sans-serif" },
          input: { fontFamily: "Inter, sans-serif" },
          label: { fontFamily: "Inter, sans-serif" },
        }
       }}
        providers={["google"]}
        theme="dark"
      />
    </div>
  );
}

export default AuthComponent;
