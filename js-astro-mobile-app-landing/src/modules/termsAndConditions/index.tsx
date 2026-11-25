import AppBanner from "@components/appBanner";
import Footer from "@components/footer";
import Navbar from "@components/navbar";
import Markdown from "react-markdown";
import { ConfigContext } from "utils/configContext";
import type { TemplateConfig } from "utils/configType";

interface Props {
  config: TemplateConfig;
}

function TermsAndConditionsPage({ config }: Props) {
  const { termsAndConditions } = config;

  return (
    <ConfigContext.Provider value={config}>
      <main>
        <Navbar />
        <section className="max-w-screen-lg mx-auto py-4 px-4 md:py-16">
          <Markdown className="prose">{termsAndConditions.content}</Markdown>
        </section>
        <AppBanner />
        <Footer />
      </main>
    </ConfigContext.Provider>
  );
}

export default TermsAndConditionsPage;
