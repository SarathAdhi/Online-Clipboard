import { Textarea } from "@components/ui/textarea";
import { ToolTip } from "@components/ui/tooltip";
import { supabase } from "@lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { uuidCharactor } from "@utils/uuid";
import { Copy, Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { getDummyProfileImage } from "@utils/profile-image";
import { ScrollArea } from "@components/ui/scroll-area";
import { Input } from "@components/ui/input";

type ActiveUserProps = {
  presence_ref: string;
  user: string;
};

let channel: RealtimeChannel;

const RealtimeCb = ({ uuid = "" }) => {
  const myId = uuidCharactor(10);

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUserProps[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    channel = supabase.channel(`clipboard-${uuid}`, {
      config: {
        broadcast: {
          self: false,
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user: myId,
        });
      }
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();

      let users = Object.values(state).map((e) => e[0]) as ActiveUserProps[];

      users.forEach((u, i) => {
        if (u.user === myId) {
          const tempUser = users[0];
          users[0] = u;

          users[i] = tempUser;
        }
      });

      setActiveUsers(users);
    });

    channel.on("broadcast", { event: "realtime-clipboard" }, ({ payload }) => {
      setText(payload.text);
    });

    channel.on("broadcast", { event: "realtime-image" }, ({ payload }) => {
      setImages(payload.images);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fileToDataUri = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event?.target?.result);
      };
      reader.readAsDataURL(file);
    });

  return (
    <div className="w-full flex flex-col gap-4 items-end flex-1">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-1">
          {activeUsers.map(({ user }: { user: string }) => (
            <Avatar key={user}>
              <AvatarImage src={getDummyProfileImage(user)} />

              <AvatarFallback>
                <div className="aspect-square h-full w-full animate-pulse bg-gray-300" />
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        <div className="space-x-2">
          <ToolTip tooltip="Copy Text">
            <button
              className="p-2 dark:bg-popover bg-white rounded-full border shadow"
              onClick={() => {
                navigator.clipboard.writeText(text);

                toast.success("Copied text to clipboard");
              }}
            >
              <Copy size={20} />
            </button>
          </ToolTip>

          <ToolTip tooltip="Share">
            <button
              className="p-2 dark:bg-popover bg-white rounded-full border shadow"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}?lc_id=${uuid}`
                );

                toast.success("Copied to clipboard");
              }}
            >
              <Share size={20} />
            </button>
          </ToolTip>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-4 flex-1 gap-y-4 md:gap-4">
        <Textarea
          ref={textareaRef}
          rows={10}
          containerClassName="col-span-3"
          className="h-full dark:caret-white caret-black"
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            channel.send({
              type: "broadcast",
              event: "realtime-clipboard",
              payload: { text: e.target.value },
            });
          }}
          placeholder="Enter Something..."
        />

        <div className="w-full md:col-span-1 flex flex-col rounded-md gap-4">
          <Input
            multiple
            onChange={async (e) => {
              const files = e.target.files;

              if (!files?.length) return;

              let _images: string[] = [...images];

              for (let i = 0; i < files?.length; i++) {
                const blob = files[i];
                const img = (await fileToDataUri(blob)) as string;

                _images.push(img);

                setImages((pre) => [...pre, img]);
              }

              channel.send({
                type: "broadcast",
                event: "realtime-image",
                payload: { images: _images },
              });
            }}
            type="file"
          />

          <ScrollArea className="md:h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols- gap-1">
              {images.map((image, index) => (
                <a href={image}>
                  <img key={index} className="w-full h-full" src={image} />
                </a>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default RealtimeCb;
