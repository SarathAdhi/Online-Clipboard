import { Button } from "@ui/button";
import { toast } from "react-hot-toast";
import { Input } from "@ui/input";
import { cn } from "@utils/cn";
import { useClipboardFunctions } from "hooks/useClipboardFunctions";
import { Copy, Share2, Loader2 } from "lucide-react";
import { ToolTip } from "@ui/tooltip";
import { useEffect } from "react";

interface ButtonWithTooltip
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
}

const ButtonWithTooltip: React.FC<ButtonWithTooltip> = ({
  children,
  tooltip,
  ...rest
}) => (
  <ToolTip tooltip={tooltip}>
    <button {...rest}>{children}</button>
  </ToolTip>
);

const ImageForm = () => {
  const {
    uuid,
    setUuid,
    imageUrl,
    imageFile,
    setImageFile,
    clipBoardUuid,
    isUuidAvailable,
    isLoading,
    autoGenerateUniqueUuid,
    handleUploadImage,
    readImageFromClipboard,
  } = useClipboardFunctions();

  useEffect(() => {
    setUuid(uuid.replace("-e", ""));
  }, [uuid]);

  return (
    <div className="grid gap-4">
      <form
        className="w-full grid gap-4 place-items-start"
        onSubmit={handleUploadImage}
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

          <Button type="button" onClick={autoGenerateUniqueUuid}>
            {isLoading ? (
              <Loader2 width="30" className="animate-spin" />
            ) : (
              "Generate ID"
            )}
          </Button>
        </div>

        <div className="w-full sm:w-auto sm:flex sm:items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files!;

              if (!file[0].type.includes("image"))
                return toast.error("Only images are allowed");

              setImageFile(file[0]);
              toast.success("Image uploaded. Save the image");
            }}
            required={!imageFile}
          />

          <p className="sm:text-center">OR</p>

          <Button
            variant="outline"
            className="w-full sm:w-auto justify-start sm:justify-center flex-shrink-0"
            type="button"
            onClick={readImageFromClipboard}
          >
            Upload from clipboard
          </Button>
        </div>

        <Button variant="success" type="submit">
          Save Image
        </Button>
      </form>

      {imageUrl && (
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

export default ImageForm;
