
import { motion } from "framer-motion";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Briefcase,
  Code2,
  Heart,
  BookOpen,
  Sparkles,
  Rocket,
  Users
} from "lucide-react";
import { AdUnit } from "@/components/ui/AdUnit";

const socialLinks = [
  { name: "GitHub", href: siteConfig.social.github, icon: Github },
  { name: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  { name: "Twitter", href: siteConfig.social.twitter, icon: Twitter },
  { name: "Email", href: `mailto:${siteConfig.author.email}`, icon: Mail }
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="container w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                <div className="relative">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto lg:mx-0 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
                    <img
                      src={siteConfig.author.avatar}
                      alt={siteConfig.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                </div>

                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {siteConfig.author.name}
                  </h1>
                  <p className="text-muted-foreground mt-1 flex items-center justify-center lg:justify-start gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {siteConfig.author.location.country}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {siteConfig.author.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-center lg:justify-start gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={social.name}
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        asChild
                      >
                        <a
                          href={social.href}
                          target={social.href.startsWith("mailto") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="sr-only">{social.name}</span>
                        </a>
                      </Button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Button className="rounded-full gap-2 flex-1" asChild>
                    <a href="/works">
                      <Briefcase className="h-4 w-4" />
                      View My Work
                    </a>
                  </Button>
                  <Button variant="outline" className="rounded-full gap-2 flex-1" asChild>
                    <a
                      href={siteConfig.social.donate}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                      Support Me
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  About Me
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  Building the Future,{" "}
                  <span className="text-muted-foreground">One Line of Code at a Time.</span>
                </h2>

                <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>{siteConfig.author.bio}</p>
                  <p>
                    My passion lies in creating open-source software that empowers developers
                    worldwide. I believe in writing clean, maintainable code that stands the
                    test of time, whether it's high-performance system libraries or modern
                    web applications.
                  </p>
                  <p>
                    When I'm not coding, you'll find me contributing to open-source projects,
                    writing technical articles, or exploring the latest advancements in
                    technology and software development.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">What I Do</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Code2 className="h-6 w-6 text-blue-500" />
                      </div>
                      <h4 className="font-semibold">Full-stack Development</h4>
                      <p className="text-sm text-muted-foreground">
                        Building end-to-end web applications with modern frameworks and best practices.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Github className="h-6 w-6 text-green-500" />
                      </div>
                      <h4 className="font-semibold">Open Source</h4>
                      <p className="text-sm text-muted-foreground">
                        Maintaining developer tools and libraries used by developers worldwide.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-orange-500" />
                      </div>
                      <h4 className="font-semibold">AI/ML Engineering</h4>
                      <p className="text-sm text-muted-foreground">
                        Developing intelligent applications using machine learning and AI technologies.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Rocket className="h-6 w-6 text-purple-500" />
                      </div>
                      <h4 className="font-semibold">Systems Engineering</h4>
                      <p className="text-sm text-muted-foreground">
                        Building high-performance, reliable systems and developer tooling.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="py-2">
                 {/* Desktop Ad */}
                 {/*
                 <div className="hidden sm:block">
                   <AdUnit
                     slot={siteConfig.adsense.slots.display.main}
                     format="horizontal"
                     fullWidthResponsive={true}
                     className="w-full"
                   />
                 </div>
                 */}
                 {/* Mobile Ad */}
                 {/*
                 <div className="sm:hidden">
                   <AdUnit
                     slot={siteConfig.adsense.slots.display.main}
                     format="rectangle"
                     fullWidthResponsive={true}
                     className="w-full"
                   />
                 </div>
                 */}
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Let's Connect</h3>
                <p className="text-muted-foreground">
                  I'm always interested in hearing about new projects, collaborations, or just
                  having a chat about technology. Feel free to reach out through any of the
                  social links or check out my projects on GitHub.
                </p>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Open to Opportunities</p>
                    <p className="text-sm text-muted-foreground">
                      Interested in collaborations and open-source contributions
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 pt-4"
              >
                <Button className="rounded-full gap-2 group" asChild>
                  <a href="/projects">
                    View Projects
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button variant="outline" className="rounded-full gap-2" asChild>
                  <a
                    href={siteConfig.social.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Portfolio
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
