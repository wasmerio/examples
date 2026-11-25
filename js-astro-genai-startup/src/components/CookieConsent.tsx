import { useState, useEffect } from "react";
import { Cookie, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/utils";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setShow(false);
  };

  const handleReject = () => {
    const rejected = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(rejected));
    setShow(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShow(false);
    setShowPreferences(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-lg border bg-background/95 backdrop-blur-sm shadow-2xl">
          {!showPreferences ? (
            // Main Banner
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    <Cookie className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, serve
                    personalized content, and analyze our traffic. By clicking
                    "Accept All", you consent to our use of cookies. Read our{" "}
                    <a
                      href={withBase("/privacy#cookies")}
                      className="text-primary hover:underline"
                    >
                      Cookie Policy
                    </a>
                    .
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReject}>
                    Reject
                  </Button>
                  <Button size="sm" onClick={handleAcceptAll}>
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Preferences Panel
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="rounded-md p-2 hover:bg-accent transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b">
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      Necessary Cookies
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Always active)
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Essential for the website to function properly. Cannot be
                      disabled.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-11 h-6 bg-primary rounded-full flex items-center px-0.5">
                      <div className="w-5 h-5 bg-white rounded-full ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Analytics Cookies</div>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        analytics: !prev.analytics,
                      }))
                    }
                    className="flex-shrink-0"
                  >
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                        preferences.analytics ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.analytics ? "ml-auto" : ""
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Marketing Cookies</div>
                    <p className="text-sm text-muted-foreground">
                      Used to deliver personalized advertisements relevant to you.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        marketing: !prev.marketing,
                      }))
                    }
                    className="flex-shrink-0"
                  >
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                        preferences.marketing ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.marketing ? "ml-auto" : ""
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPreferences(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
