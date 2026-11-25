import AppBanner from "@components/appBanner";
import Footer from "@components/footer";
import Navbar from "@components/navbar";
import Markdown from "react-markdown";
import { ConfigContext } from "utils/configContext";
import type { TemplateConfig } from "utils/configType";

interface Props {
  config: TemplateConfig;
}

function PrivacyPolicyPage({ config }: Props) {
  const { privacyPolicy } = config;

  return (
    <ConfigContext.Provider value={config}>
      <main>
        <Navbar />
        <section className="max-w-screen-lg mx-auto py-4 px-4 md:py-16">
          <Markdown className="prose">{privacyPolicy.content}</Markdown>
        </section>
        <AppBanner />
        <Footer />
      </main>
    </ConfigContext.Provider>
  );
}

export default PrivacyPolicyPage;
