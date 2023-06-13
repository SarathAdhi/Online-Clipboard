import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";
import { toast } from "react-hot-toast";
import { Input } from "@ui/input";
import { cn } from "@utils/cn";
import { useClipboardFunctions } from "hooks/useClipboardFunctions";
import { Copy, Share2, Loader2 } from "lucide-react";
import { ToolTip } from "@ui/tooltip";

interface ButtonWithTooltip
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
}

const ButtonWithTooltip: React.FC<ButtonWithTooltip> = ({
  children,
  tooltip,
  ...rest
}) => (
  <ToolTip align="start" tooltip={tooltip}>
    <button {...rest}>{children}</button>
  </ToolTip>
);

const TextForm = () => {
  const {
    text,
    setText,
    uuid,
    setUuid,
    password,
    setPassword,
    clipBoardUuid,
    isUuidAvailable,
    isLoading,
    isTextEditable,
    handleSaveClipBoard,
    autoGenerateUniqueUuid,
  } = useClipboardFunctions();

  return (
    <div className="grid gap-4">
      <form
        className="w-full grid gap-4 place-items-start"
        onSubmit={handleSaveClipBoard}
      >
        <div className="w-full flex items-end justify-start flex-wrap gap-2 sm:gap-4">
          <Input
            label="Clipboard ID"
            name="id"
            placeholder="Enter custom ID"
            value={uuid}
            containerClassName="w-full sm:w-auto"
            className={cn(
              uuid
                ? isUuidAvailable
                  ? "border-green-500"
                  : "border-red-500"
                : ""
            )}
            onChange={(e) => setUuid(e.target.value.toLowerCase())}
            required
          />

          <Button type="button" onClick={() => autoGenerateUniqueUuid(true)}>
            {isLoading.generateIdBtn ? (
              <Loader2 width="30" className="animate-spin" />
            ) : (
              "Generate ID"
            )}
          </Button>
        </div>

        {isTextEditable && (
          <Input
            name="password"
            label="Clipboard Password"
            type="password"
            placeholder="Enter a password. This is needed when you edit it."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <Textarea
          name="text"
          label="Clipboard Text"
          value={text}
          placeholder="Type something here"
          rows={6}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <Button variant="success" type="submit">
          {isLoading.saveTextBtn ? (
            <Loader2 width="30" className="animate-spin" />
          ) : (
            "Save Text"
          )}
        </Button>
      </form>

      {clipBoardUuid && (
        <div className="flex items-center gap-4">
          <ButtonWithTooltip
            tooltip="Copy"
            onClick={() => {
              navigator.clipboard.writeText(clipBoardUuid);
              toast.success("Copied to you clipboard");
            }}
          >
            <Copy size="20" />
          </ButtonWithTooltip>

          <ButtonWithTooltip
            tooltip="Share"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/?id=${clipBoardUuid}`
              );
              toast.success("Copied to you clipboard");
            }}
          >
            <Share2 size="20" />
          </ButtonWithTooltip>
        </div>
      )}
    </div>
  );
};

export default TextForm;
