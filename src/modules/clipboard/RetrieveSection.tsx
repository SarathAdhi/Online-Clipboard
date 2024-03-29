import { useEffect, useState } from "react";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { supabase } from "@lib/supabase";
import { toast } from "react-hot-toast";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { linkify } from "@utils/linkify";
import { Loader2 } from "lucide-react";

const RetrieveSection = ({
  _clipBoardUuid = "",
  _clipBoardText = "",
  _clipBoardType = "text",
}) => {
  const [clipBoardUuid, setClipBoardUuid] = useState(_clipBoardUuid);
  const [clipBoardText, setClipBoardText] = useState(_clipBoardText);
  const [clipboardType, setClipboardType] = useState(_clipBoardType);
  const [isLoading, setIsLoading] = useState(false);
  const [enableTextEditing, setEnableTextEditing] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (_clipBoardText && _clipBoardType === "text") {
      navigator.clipboard.writeText(_clipBoardText);

      toast.success("Copied to Clipboard", {
        position: "bottom-center",
      });
    }
  }, [_clipBoardText]);

  const isTextEditable =
    clipBoardUuid?.split("-")[1]?.toLocaleLowerCase() === "e";

  async function findClipBoard(e?: React.FormEvent) {
    e?.preventDefault();

    setClipBoardText("");

    setIsLoading(true);

    try {
      const { data } = await supabase
        .from(isTextEditable ? "clipboard-edit" : "clipboard")
        .select("*")
        .eq("uuid", clipBoardUuid);

      if (data && data.length !== 0) {
        if (isTextEditable && data[0].password !== password)
          throw new Error("Incorrect Password");

        const _clipBoardText = data[0].text;

        const _clipboardType = data[0].type || "text";

        setClipboardType(_clipboardType);

        if (_clipboardType === "text") {
          navigator.clipboard.writeText(_clipBoardText);

          toast.success("Copied to Clipboard", {
            position: "bottom-center",
          });
        }

        setClipBoardText(_clipBoardText);
      }
      //
      else throw new Error("Clipboard not found");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong", {
        position: "bottom-center",
      });
    }

    setIsLoading(false);
  }

  async function handleClipBoardUpdate() {
    try {
      await supabase
        .from("clipboard-edit")
        .update({ text: clipBoardText })
        .eq("uuid", clipBoardUuid);

      toast.success("Updated successfully", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-center",
      });
    }

    setEnableTextEditing(false);
  }

  const isTextFoundAndEditable = isTextEditable && !!clipBoardText;

  return (
    <div className="card flex flex-col gap-4">
      <h2 className="w-full underline">Retrieve from Clipboard:</h2>

      <form
        onSubmit={findClipBoard}
        className="w-full grid gap-4 place-items-start"
      >
        <Input
          name="retrieve-id"
          label="Retrieve ID"
          placeholder="Enter the retrieve ID"
          type="text"
          value={clipBoardUuid}
          onChange={(e) => setClipBoardUuid(e.target.value.toLowerCase())}
          required
        />

        {isTextEditable && (
          <Input
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={(e) => _clipBoardUuid && !enableTextEditing && e?.focus()}
            required
          />
        )}

        <Button variant="success" type="submit">
          {isLoading ? (
            <Loader2 width="30" className="animate-spin" />
          ) : (
            "Retrieve"
          )}
        </Button>

        {!!clipBoardText && (
          <>
            <hr className="w-full border-gray-300 border my-2 rounded-lg" />

            {clipBoardUuid && (
              <div
                className="absolute"
                ref={(e) => e?.scrollIntoView({ behavior: "smooth" })}
              />
            )}

            <div className="w-full grid gap-2">
              {enableTextEditing ? (
                <>
                  <Textarea
                    value={clipBoardText}
                    rows={6}
                    onChange={(e) => setClipBoardText(e.target.value)}
                    disabled={!enableTextEditing}
                  />

                  <div className="flex justify-end items-end flex-wrap gap-2">
                    {isTextFoundAndEditable && (
                      <Button
                        variant="success"
                        type="button"
                        onClick={handleClipBoardUpdate}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </>
              ) : clipboardType === "image" ? (
                <img src={clipBoardText} alt="Saved Image" />
              ) : (
                <>
                  <ScrollArea className="card !p-0 border max-h-[500px]">
                    <div
                      className="whitespace-pre-line p-2 sm:p-4"
                      dangerouslySetInnerHTML={{
                        __html: linkify(clipBoardText),
                      }}
                    />
                  </ScrollArea>

                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <p>
                      Text automatically copied to your{" "}
                      <strong>Clipboard</strong>.
                    </p>

                    {isTextEditable && (
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setEnableTextEditing(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default RetrieveSection;
