import { supabase } from "@lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { uuid as funcUuid } from "@utils/uuid";
import { useStore } from "@nanostores/react";
import { saveClipBoardId } from "@utils/store";

export const useClipboardFunctions = () => {
  const [text, setText] = useState("");
  const [uuid, setUuid] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<Blob>();
  const [password, setPassword] = useState("");

  const [clipBoardUuid, setClipBoardUuid] = useState("");
  const [isUuidAvailable, setIsUuidAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState({
    generateIdBtn: false,
    saveTextBtn: false,
    saveImgBtn: false,
  });

  const $saveClipBoardId = useStore(saveClipBoardId);

  useEffect(() => {
    // setUuid($saveClipBoardId);
    if ($saveClipBoardId) autoGenerateUniqueUuid(true, true);
  }, [$saveClipBoardId]);

  useEffect(() => {
    checkForUuidAvailability();
  }, [uuid]);

  const isTextEditable = uuid?.split("-")[1]?.toLowerCase() === "e";

  async function checkForUuidAvailability() {
    if (!uuid) {
      setIsUuidAvailable(false);
    }
    //
    else {
      const { data } = await supabase
        .from(isTextEditable ? "clipboard-edit" : "clipboard")
        .select("*")
        .eq("uuid", uuid);

      if (data && data.length !== 0) setIsUuidAvailable(false);
      else setIsUuidAvailable(true);
    }
  }

  async function handleSaveClipBoard(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading({
      ...isLoading,
      saveTextBtn: true,
    });

    if (!text) {
      toast.error("Enter some TEXT");
      return;
    }

    if (!isUuidAvailable) {
      toast.error("ID not available");
      return;
    }

    try {
      if (isTextEditable)
        await supabase.from("clipboard-edit").insert({ uuid, text, password });
      else await supabase.from("clipboard").insert({ uuid, text });

      setClipBoardUuid(uuid);
      setText("");
      setPassword("");
      setUuid("");

      toast.success("Saved");
    } catch (error) {
      toast.error("Something went wrong");
    }

    setIsLoading({
      ...isLoading,
      saveTextBtn: false,
    });
  }

  async function autoGenerateUniqueUuid(
    setLoadingState = false,
    passwordProtection = false
  ) {
    if (setLoadingState)
      setIsLoading({
        ...isLoading,
        generateIdBtn: true,
      });

    let _uuid = funcUuid();
    _uuid = passwordProtection ? `${_uuid}-e` : _uuid;
    let i = 0;

    const isTextEditable = _uuid?.split("-")[1]?.toLocaleLowerCase() === "e";

    while (i > 5) {
      const { data } = await supabase
        .from(isTextEditable ? "clipboard-edit" : "clipboard")
        .select("*")
        .eq("uuid", _uuid);

      if (data?.length === 0) break;
      else _uuid = funcUuid();

      ++i;
    }

    if (setLoadingState)
      setIsLoading({
        ...isLoading,
        generateIdBtn: false,
      });

    setUuid(_uuid);
  }

  async function readImageFromClipboard() {
    const item_list = await navigator.clipboard.read();

    let image_type = "";
    const item = item_list.find((item) =>
      item.types.some((type) => {
        if (type.startsWith("image/")) {
          image_type = type;
          return true;
        }
      })
    );

    const file = item && (await item.getType(image_type));

    if (!file) return toast.error("No recent image found in clipboard");

    setImageFile(file);

    toast.success("Image uploaded. Save the image");

    autoGenerateUniqueUuid();
  }

  async function handleUploadImage(e?: React.FormEvent) {
    e?.preventDefault();

    setIsLoading({
      ...isLoading,
      saveImgBtn: true,
    });

    if (!uuid) return toast.error("Enter the clipboard ID");

    if (!imageFile) return toast.error("Image not found");

    const { error } = await supabase.storage
      .from("clipboard-img")
      .upload(`clipboard-${uuid}`, imageFile);

    if (error) return toast.error(error.message);

    try {
      const { data } = supabase.storage
        .from("clipboard-img")
        .getPublicUrl(`clipboard-${uuid}`);

      await supabase
        .from("clipboard")
        .insert({ uuid, text: data.publicUrl, type: "image" });

      toast.success("Saved");

      setImageUrl(data.publicUrl);
      setClipBoardUuid(uuid);
      setUuid("");
    } catch (error) {
      toast.error("Something went wrong");
    }

    setIsLoading({
      ...isLoading,
      saveImgBtn: false,
    });
  }

  return {
    text,
    setText,
    uuid,
    setUuid,
    imageUrl,
    imageFile,
    setImageFile,
    password,
    setPassword,
    clipBoardUuid,
    setClipBoardUuid,
    isUuidAvailable,
    setIsUuidAvailable,
    isLoading,
    setIsLoading,
    isTextEditable,
    checkForUuidAvailability,
    handleSaveClipBoard,
    autoGenerateUniqueUuid,
    handleUploadImage,
    readImageFromClipboard,
  };
};
