import { Textarea } from "@components/ui/textarea";
import { ToolTip } from "@components/ui/tooltip";
import { supabase } from "@lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { uuidCharactor } from "@utils/uuid";
import { Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar, AvatarImage } from "@ui/avatar";
import { getDummyProfileImage } from "@utils/profile-image";

type ActiveUserProps = {
  presence_ref: string;
  user: string;
};

let channel: RealtimeChannel;

const RealtimeCb = ({ uuid = "" }) => {
  const myId = uuidCharactor(10);

  const [text, setText] = useState("");
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

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 items-end flex-1">
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {activeUsers.map(({ user }: { user: string }) => (
            <Avatar key={user}>
              <AvatarImage src={getDummyProfileImage(user)} />
            </Avatar>
          ))}
        </div>

        <ToolTip tooltip="Share">
          <button
            className="p-2 bg-white rounded-full border shadow"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}?rtid=${uuid}`
              );

              toast.success("Copied to clipboard");
            }}
          >
            <Share size={20} />
          </button>
        </ToolTip>
      </div>

      <div className="w-full flex flex-1">
        <Textarea
          ref={textareaRef}
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
      </div>
    </div>
  );
};

export default RealtimeCb;
