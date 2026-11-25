import { useContext } from "react";
import { ConfigContext } from "../../utils/configContext";
import InstagramLogo from "./svgs/instagram";
import FacebookLogo from "./svgs/facebook";
import TwitterLogo from "./svgs/twitter";
import { motion } from "framer-motion";

function Footer() {
  const {
    footer: { links, legalLinks, socials },
  } = useContext(ConfigContext)!;

  return (
    <footer className="relative bg-neutral text-neutral-content px-4 pt-0 pb-12">
      <div className="absolute rounded-t-[50%] -top-12 left-0 bg-neutral w-full h-12" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-screen-lg mx-auto mt-12"
      >
        <nav className="flex flex-col items-start gap-4">
          {links.map(({ title, href }, index) => (
            <motion.a
              key={index}
              variants={{
                hidden: { opacity: 0, x: "-100%" },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ delay: index * 0.25 }}
              className="text-xl font-bold block uppercase whitespace-nowrap link no-underline text-primary hover:text-primary/50 md:text-4xl"
              href={href}
            >
              {title}
            </motion.a>
          ))}
        </nav>
        <aside className="flex flex-col items-center justify-between mt-4 w-full overflow-hidden md:flex-row lg:overflow-visible">
          <div className="flex items-center gap-3 w-full text-primary">
            {socials?.facebook && (
              <motion.a
                variants={{
                  hidden: { opacity: 0, x: "-100%" },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ delay: 0.25 }}
                className="w-8 h-8 hover:text-primary/50"
                target="_blank"
                href={socials.facebook}
              >
                <FacebookLogo />
              </motion.a>
            )}
            {socials?.instagram && (
              <motion.a
                variants={{
                  hidden: { opacity: 0, x: "-100%" },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ delay: 0.5 }}
                className="w-8 h-8 hover:text-primary/50"
                target="_blank"
                href={socials.instagram}
              >
                <InstagramLogo />
              </motion.a>
            )}
            {socials?.twitter && (
              <motion.a
                variants={{
                  hidden: { opacity: 0, x: "-100%" },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ delay: 0.75 }}
                className="w-8 h-8 hover:text-primary/50"
                target="_blank"
                href={socials.twitter}
              >
                <TwitterLogo />
              </motion.a>
            )}
          </div>
          <div className="flex gap-4 mt-8 mb-4 md:m-0">
            {legalLinks.termsAndConditions && (
              <motion.a
                variants={{
                  hidden: { opacity: 0, scale: 0.4 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ delay: 0.25 }}
                className="font-bold text-primary hover:text-primary/50 lg:whitespace-nowrap"
                href="/terms-and-conditions"
              >
                Terms & conditions
              </motion.a>
            )}
            {legalLinks.privacyPolicy && (
              <motion.a
                variants={{
                  hidden: { opacity: 0, scale: 0.4 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ delay: 0.5 }}
                className="font-bold text-primary hover:text-primary/50 lg:whitespace-nowrap"
                href="/privacy-policy"
              >
                Privacy policy
              </motion.a>
            )}
            {legalLinks.cookiesPolicy && (
              <motion.a
                variants={{
                  hidden: { opacity: 0, scale: 0.4 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ delay: 0.75 }}
                className="font-bold text-primary hover:text-primary/50 lg:whitespace-nowrap"
                href="/cookies-policy"
              >
                Cookies policy
              </motion.a>
            )}
          </div>
          <motion.p
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ delay: 1 }}
            className="mt-0.5 md:ml-4 md:whitespace-nowrap"
          >
            All rights reserved © {new Date().getFullYear()}
          </motion.p>
        </aside>
      </motion.div>
    </footer>
  );
}

export default Footer;
