import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useUrlMinifierFunctions } from "hooks/useUrlMinifierFunctions";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const UrlMinifierForm = ({ origin = "" }) => {
  const { handleFormSubmit, setUrl, url, shortName, isLoading } =
    useUrlMinifierFunctions();

  const shortenUrl = `${origin}/${shortName}`;

  return (
    <div className="space-y-4">
      <form
        className="card flex flex-col items-start gap-4"
        onSubmit={handleFormSubmit}
      >
        <h1 className="mb-2">URL Shortener with Stats</h1>

        <Input
          label="Url"
          name="url"
          placeholder="Enter the URL to be shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <Button type="submit">
          {isLoading ? (
            <Loader2 width="30" className="animate-spin" />
          ) : (
            "Short"
          )}
        </Button>
      </form>

      {shortName && (
        <div className="card flex flex-col items-center justify-center gap-4">
          <a target="_blank" href={url}>
            {url}
          </a>

          <a target="_blank" href={shortenUrl}>
            {shortenUrl}
          </a>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shortenUrl);
                toast.success("Copied to clipboard");
              }}
            >
              Copy
            </Button>

            <Button variant="outline" asChild>
              <a target="_blank" href={`${shortenUrl}+`}>
                Stats
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlMinifierForm;
