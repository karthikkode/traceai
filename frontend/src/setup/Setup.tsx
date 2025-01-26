import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code"; // Custom Code component for styled code snippets
import { CopyToClipboard } from "react-copy-to-clipboard";

function Setup() {
  const scriptFileCode = `
trace-click="restaurant"
trace-hover="restaurant"
`;

  const useEffectCode = `
useEffect(() => {
  const script = document.createElement("script");
  script.src = "/eventLogger.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
`;

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <Card className="max-w-3xl w-full bg-slate-800 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Setup Instructions</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">1. Download the Script</h3>
              <a
                href="/script.js"
                download
                className="text-blue-500 underline hover:text-blue-400"
              >
                Click here to download the script
              </a>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">2. Place in Public Folder</h3>
              <p className="text-slate-300">
                Place the downloaded script file in the <code>public</code>{" "}
                folder of your React project. This ensures that it can be
                accessed by your application.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">
                3. Add Attributes for Tracking
              </h3>
              <p className="text-slate-300">
                Add the following attributes to elements you want to track:
              </p>
              <Code className="block bg-slate-500 p-4 rounded border border-slate-500">
                {scriptFileCode}
                <CopyToClipboard text={scriptFileCode}>
                  <Button variant="outline" className="mt-2">
                    Copy to Clipboard
                  </Button>
                </CopyToClipboard>
              </Code>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">4. Add the useEffect Hook</h3>
              <p className="text-slate-300">
                To dynamically load the <code>eventLogger.js</code> script, add
                the following <code>useEffect</code> hook in your setup:
              </p>
              <Code className="block bg-slate-500 p-4 rounded border border-slate-500">
                {useEffectCode}
                <CopyToClipboard text={useEffectCode}>
                  <Button variant="outline" className="mt-4">
                    Copy to Clipboard
                  </Button>
                </CopyToClipboard>
              </Code>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Setup;
