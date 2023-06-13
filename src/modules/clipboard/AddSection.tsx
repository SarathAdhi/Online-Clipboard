import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import TextForm from "./(components)/TextForm";
import ImageForm from "./(components)/ImageForm";

const AddSection = () => {
  return (
    <div className="card flex flex-col gap-4">
      <Tabs defaultValue="text" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="w-full underline">Save to Clipboard:</h2>

          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="text">
          <TextForm />
        </TabsContent>

        <TabsContent value="image">
          <ImageForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddSection;
