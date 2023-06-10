import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { ToolTip } from "@components/ui/tooltip";
import { supabase } from "@lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getDummyProfileImage } from "@utils/profile-image";
import { uuidCharactor } from "@utils/uuid";
import { Download, Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

type ActiveUserProps = {
  presence_ref: string;
  user: string;
  color: string;
};

function getDarkColor() {
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}

const myColor = getDarkColor();

let channel: RealtimeChannel;

const ScribbleBoard = ({ uuid = "" }) => {
  const boardRef = useRef<ReactSketchCanvasRef>(null);

  const myId = uuidCharactor(10);

  const [activeUsers, setActiveUsers] = useState<ActiveUserProps[]>([]);
  const [drawnImage, setDrawnImage] = useState("");

  useEffect(() => {
    channel = supabase.channel(`scribble-${uuid}`, {
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
          color: myColor,
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

    channel.on("broadcast", { event: "realtime-scribble" }, ({ payload }) => {
      setDrawnImage(payload?.image);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="bg-white rounded-full p-1 flex items-center flex-wrap gap-1">
          {activeUsers.map(({ user, color }) => {
            return (
              <Avatar
                key={user}
                className="!border-4"
                style={{
                  borderColor: color,
                }}
              >
                <AvatarImage src={getDummyProfileImage(user)} />

                <AvatarFallback>
                  <div className="aspect-square h-full w-full animate-pulse bg-gray-300" />
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>

        <div className="space-x-2">
          <ToolTip tooltip="Download Scribble">
            <button
              className="p-2 dark:bg-popover bg-white rounded-full border shadow"
              onClick={async () => {
                const img = await boardRef.current?.exportImage("png");

                var a = document.createElement("a");
                a.href = img || "";
                a.download = "Image.png";
                a.click();
              }}
            >
              <Download size={20} />
            </button>
          </ToolTip>

          <ToolTip tooltip="Share">
            <button
              className="p-2 bg-green-600 text-white rounded-full border shadow"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/scribble?id=${uuid}`
                );

                toast.success("Copied to clipboard");
              }}
            >
              <Share size={20} />
            </button>
          </ToolTip>
        </div>
      </div>

      <ReactSketchCanvas
        className="!rounded-md overflow-hidden"
        height="500px"
        ref={boardRef}
        backgroundImage={drawnImage}
        onChange={async (e) => {
          if (e.length === 0) return;

          const image = await boardRef.current?.exportImage("png");

          channel.send({
            type: "broadcast",
            event: "realtime-scribble",
            payload: { image },
          });
        }}
        strokeWidth={4}
        strokeColor={myColor}
      />
    </div>
  );
};

export default ScribbleBoard;
