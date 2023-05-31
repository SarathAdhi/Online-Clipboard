import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useUrlMinifierFunctions } from "hooks/useUrlMinifierFunctions";
import { toast } from "react-hot-toast";

const UrlMinifierForm = ({ origin = "" }) => {
  const { handleFormSubmit, setUrl, url, shortName } =
    useUrlMinifierFunctions();

  const shortenUrl = `${origin}/${shortName}`;

  return (
    <div className="space-y-4">
      <form className="card grid gap-2" onSubmit={handleFormSubmit}>
        <h1 className="mb-2">URL shortener with Stats</h1>

        <Input
          label="Url"
          name="url"
          placeholder="Enter the URL to be shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <Button type="submit">Short</Button>
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
