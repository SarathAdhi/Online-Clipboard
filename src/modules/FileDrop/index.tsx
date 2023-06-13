import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { supabase } from "@lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getDummyProfileImage } from "@utils/profile-image";
import { uuidCharactor } from "@utils/uuid";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type ActiveUserProps = {
  presence_ref: string;
  user: string;
  color: string;
};

let channel: RealtimeChannel;

const FileDrop = ({ uuid = "" }) => {
  const myId = uuidCharactor(10);

  const [activeUsers, setActiveUsers] = useState<ActiveUserProps[]>([]);

  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [isFileSent, setIsFileSent] = useState(false);
  const [isFileSending, setIsFileSending] = useState(false);

  useEffect(() => {
    channel = supabase.channel(`file-drop-${uuid}`, {
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

    channel.on("broadcast", { event: "realtime-file-drop" }, ({ payload }) => {
      const newFile = new Blob(
        [new Uint8Array(Object.values(payload.value))!],
        {
          type: payload.fileType,
        }
      );

      const _fileUrl = URL.createObjectURL(newFile);

      setFileExt(payload.ext);
      setFileUrl(_fileUrl);

      channel.send({
        type: "broadcast",
        event: "realtime-file-received",
        payload: { value: true },
      });
    });

    channel.on(
      "broadcast",
      { event: "realtime-file-received" },
      ({ payload }) => {
        setIsFileSending(false);

        setIsFileSent(payload.value);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function handleTransferFile() {
    if (!file) return toast.error("Upload a file");

    setIsFileSending(true);

    const fileExt = "." + file.name.split(".")[1];
    const fileType = file.type;

    const stream = file.stream();
    const reader = stream.getReader();

    const { value } = await reader.read();

    console.log({ value });

    await channel.send({
      type: "broadcast",
      event: "realtime-file-drop",
      payload: {
        value: value,
        ext: fileExt,
        fileType,
      },
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white rounded-full p-1 flex items-center flex-wrap gap-1">
        {activeUsers.map(({ user }: { user: string }) => (
          <Avatar key={user}>
            <AvatarImage src={getDummyProfileImage(user)} />

            <AvatarFallback>
              <div className="aspect-square h-full w-full animate-pulse bg-gray-300" />
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      <div className="w-full flex items-center justify-between gap-2">
        <Input onChange={(e) => setFile(e.target.files![0])} type="file" />

        <Button
          onClick={handleTransferFile}
          variant="success"
          className="flex-shrink-0"
        >
          Transfer
        </Button>
      </div>

      <div className="w-full flex flex-col items-center text-center gap-2">
        {isFileSending && <Loader size={40} className="animate-spin" />}
        {isFileSent && <h4>File sent successfully</h4>}

        {fileUrl && (
          <Button asChild>
            <a href={fileUrl} download={`file${fileExt}`}>
              Download File
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileDrop;
