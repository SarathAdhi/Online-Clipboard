import { supabase } from "@lib/supabase";
import { toast } from "react-hot-toast";
import { uuidCharactor } from "@utils/uuid";
import { useState } from "react";

export const useUrlMinifierFunctions = () => {
  const [url, setUrl] = useState("");
  const [shortName, setShortName] = useState("");

  // const { data, error } = await supabase
  //       .from("url-minifier")
  //       .select("*")
  //       .eq("uuid", uuid);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    const name = uuidCharactor();
    setShortName(name);

    const { data, error } = await supabase
      .from("url-minifier")
      .insert({ url, name, stats: [] });

    if (error) return toast.error(error.message);

    return toast.success("Url minified");
  }

  return { handleFormSubmit, shortName, url, setUrl };
};
