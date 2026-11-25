import { useState } from "react";
import { MagicCard } from "@/components/MagicCard";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GradientText } from "@/components/GradientText";
import { GlassCard } from "@/components/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ShimmerButton } from "@/components/ShimmerButton";
import { EmptyState } from "@/components/EmptyState";
import { PricingToggle } from "@/components/PricingToggle";
import { FeatureComparison } from "@/components/FeatureComparison";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Brain,
  Database,
  FileQuestion,
  Rocket,
  Shield,
  Wand2,
} from "lucide-react";

export function AdvancedShowcase() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);

  const sampleLogos = [
    { name: "Vercel", url: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
    { name: "Next.js", url: "https://nextjs.org/static/favicon/favicon-32x32.png" },
    { name: "React", url: "https://react.dev/favicon-32x32.png" },
    { name: "Tailwind", url: "https://tailwindcss.com/favicons/favicon-32x32.png?v=3" },
    { name: "TypeScript", url: "https://www.typescriptlang.org/favicon-32x32.png" },
  ];

  const comparisonFeatures = [
    { name: "API Access", free: true, pro: true, enterprise: true },
    { name: "Advanced Models", free: false, pro: true, enterprise: true },
    { name: "Priority Support", free: false, pro: true, enterprise: true },
    { name: "Custom Training", free: false, pro: false, enterprise: true },
    { name: "On-Premise Deploy", free: false, pro: false, enterprise: true },
    { name: "SLA Guarantee", free: false, pro: true, enterprise: true },
  ];

  return (
    <div className="space-y-16">
      {/* Magic Card - Featured */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">Magic Card</h2>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Wand2 className="h-3 w-3" />
            Featured
          </span>
        </div>
        <p className="text-muted-foreground mb-6">
          Interactive 3D card with spotlight effect, shimmer animation, and smooth tilt
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MagicCard className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">AI Powered</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Hover over this card to see the magic! Watch as the spotlight follows
              your cursor with smooth 3D tilt effects.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                Interactive
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                3D Effect
              </span>
            </div>
          </MagicCard>

          <MagicCard
            className="p-8"
            gradientColor="#3b82f6"
            gradientSize={250}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Customizable gradient colors and sizes. Each card can have its own
              unique spotlight effect.
            </p>
            <Button className="w-full">
              <Rocket className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </MagicCard>
        </div>
        <CodeBlock
          code={`import { MagicCard } from "@/components/MagicCard";

<MagicCard className="p-8">
  <h3>Your Content</h3>
  <p>Hover to see the magic!</p>
</MagicCard>

{/* Custom gradient color */}
<MagicCard
  gradientColor="#3b82f6"
  gradientSize={250}
  gradientOpacity={0.6}
>
  <p>Blue spotlight effect</p>
</MagicCard>`}
        />
      </section>

      {/* Bento Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Bento Grid</h2>
        <p className="text-muted-foreground mb-6">
          Modern grid layout for showcasing features with varied sizes
        </p>
        <BentoGrid>
          <BentoCard
            name="AI Models"
            className="md:col-span-2"
            Icon={Brain}
            description="Access cutting-edge AI models with simple API calls"
            href="#"
            cta="Learn more"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            }
          />
          <BentoCard
            name="Fast API"
            Icon={Zap}
            description="Lightning-fast response times"
            href="#"
            cta="Try now"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20" />
            }
          />
          <BentoCard
            name="Secure"
            Icon={Shield}
            description="Enterprise-grade security"
            href="#"
            cta="Read more"
          />
          <BentoCard
            name="Scalable"
            className="md:col-span-2"
            Icon={Database}
            description="Scale from prototype to production seamlessly"
            href="#"
            cta="Get started"
          />
        </BentoGrid>

        <div className="mt-6">
          <CodeBlock
            code={`import { BentoGrid, BentoCard } from "@/components/BentoGrid";

<BentoGrid>
  <BentoCard
    name="AI Models"
    className="md:col-span-2"
    Icon={Brain}
    description="Access cutting-edge AI models"
    href="#"
    cta="Learn more"
  />
</BentoGrid>`}
          />
        </div>
      </section>

      {/* Marquee Logos */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Marquee Logos</h2>
        <p className="text-muted-foreground mb-6">
          Infinite scrolling logo carousel for trusted by sections
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <MarqueeLogos logos={sampleLogos} />
          <div className="mt-6">
            <CodeBlock
              code={`import { MarqueeLogos } from "@/components/MarqueeLogos";

const logos = [
  { name: "Vercel", url: "/logos/vercel.png" },
  { name: "Next.js", url: "/logos/nextjs.png" },
];

<MarqueeLogos logos={logos} />`}
            />
          </div>
        </div>
      </section>

      {/* Animated Counter */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Animated Counter</h2>
        <p className="text-muted-foreground mb-6">
          Numbers that count up with smooth animations
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">
                <AnimatedCounter value={10000} suffix="+" />
              </p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">
                <AnimatedCounter value={99.9} decimals={1} suffix="%" />
              </p>
              <p className="text-muted-foreground">Uptime</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">
                <AnimatedCounter value={1.2} decimals={1} suffix="M" prefix="$" />
              </p>
              <p className="text-muted-foreground">Revenue</p>
            </div>
          </div>
          <div className="mt-6">
            <CodeBlock
              code={`import { AnimatedCounter } from "@/components/AnimatedCounter";

<AnimatedCounter value={10000} suffix="+" />
<AnimatedCounter value={99.9} decimals={1} suffix="%" />`}
            />
          </div>
        </div>
      </section>

      {/* Gradient Text */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Gradient Text</h2>
        <p className="text-muted-foreground mb-6">
          Eye-catching gradient text with optional animation
        </p>
        <div className="p-8 rounded-2xl border bg-card space-y-4">
          <h3 className="text-4xl font-bold">
            Build with{" "}
            <GradientText>GenAI</GradientText>
          </h3>
          <h3 className="text-4xl font-bold">
            Powered by{" "}
            <GradientText animate>Artificial Intelligence</GradientText>
          </h3>
          <h3 className="text-4xl font-bold">
            <GradientText from="from-blue-600" to="to-cyan-600">
              Custom Colors
            </GradientText>
          </h3>
          <div className="mt-6">
            <CodeBlock
              code={`import { GradientText } from "@/components/GradientText";

<GradientText>Default Gradient</GradientText>
<GradientText animate>Animated</GradientText>
<GradientText from="from-blue-600" to="to-cyan-600">
  Custom
</GradientText>`}
            />
          </div>
        </div>
      </section>

      {/* Glass Card */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Glass Card</h2>
        <p className="text-muted-foreground mb-6">
          Beautiful glass morphism effect cards
        </p>
        <div className="relative p-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
          <GlassCard className="p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-2 text-white">Glass Effect</h3>
            <p className="text-white/90">
              This card uses backdrop blur and translucent backgrounds to create
              a glass morphism effect that looks stunning on colorful backgrounds.
            </p>
          </GlassCard>
        </div>
        <div className="mt-6">
          <CodeBlock
            code={`import { GlassCard } from "@/components/GlassCard";

<GlassCard blur="md">
  <p>Content with glass effect</p>
</GlassCard>`}
          />
        </div>
      </section>

      {/* Switch */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Switch</h2>
        <p className="text-muted-foreground mb-6">
          Toggle switches for boolean settings
        </p>
        <div className="p-8 rounded-2xl border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about your account
              </p>
            </div>
            <Switch
              checked={switchEnabled}
              onCheckedChange={setSwitchEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing emails</p>
              <p className="text-sm text-muted-foreground">
                Receive news and product updates
              </p>
            </div>
            <Switch />
          </div>
          <div className="mt-6">
            <CodeBlock
              code={`import { Switch } from "@/components/ui/switch";

<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
/>`}
            />
          </div>
        </div>
      </section>

      {/* Tooltip */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Tooltip</h2>
        <p className="text-muted-foreground mb-6">
          Helpful tooltips on hover
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="flex gap-4 flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>With Icon <Sparkles className="ml-2 h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tooltips can be placed on any element</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-6">
            <CodeBlock
              code={`import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
            />
          </div>
        </div>
      </section>

      {/* Skeleton */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Skeleton</h2>
        <p className="text-muted-foreground mb-6">
          Loading placeholders for better UX
        </p>
        <div className="p-8 rounded-2xl border bg-card space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="mt-6">
            <CodeBlock
              code={`import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-[200px] w-full" />`}
            />
          </div>
        </div>
      </section>

      {/* Shimmer Button */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Shimmer Button</h2>
        <p className="text-muted-foreground mb-6">
          Buttons with animated shimmer effect
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="flex gap-4 flex-wrap">
            <ShimmerButton>Get Started</ShimmerButton>
            <ShimmerButton background="bg-gradient-to-r from-blue-600 to-cyan-600">
              Learn More
            </ShimmerButton>
            <ShimmerButton background="bg-gradient-to-r from-green-600 to-emerald-600">
              <Rocket className="mr-2 h-4 w-4" />
              Launch Now
            </ShimmerButton>
          </div>
          <div className="mt-6">
            <CodeBlock
              code={`import { ShimmerButton } from "@/components/ShimmerButton";

<ShimmerButton>Get Started</ShimmerButton>
<ShimmerButton background="bg-gradient-to-r from-blue-600 to-cyan-600">
  Custom Color
</ShimmerButton>`}
            />
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Empty State</h2>
        <p className="text-muted-foreground mb-6">
          Friendly empty states with call-to-action
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <EmptyState
            icon={FileQuestion}
            title="No data found"
            description="We couldn't find any results. Try adjusting your search or create a new item to get started."
            action={{
              label: "Create New",
              onClick: () => alert("Creating new item..."),
            }}
          />
          <div className="mt-6">
            <CodeBlock
              code={`import { EmptyState } from "@/components/EmptyState";

<EmptyState
  icon={FileQuestion}
  title="No data found"
  description="Try adjusting your search..."
  action={{
    label: "Create New",
    onClick: handleCreate,
  }}
/>`}
            />
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Pricing Toggle</h2>
        <p className="text-muted-foreground mb-6">
          Switch between monthly and annual pricing
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="flex flex-col items-center gap-4">
            <PricingToggle
              onChange={(annual) => setIsAnnual(annual)}
              defaultAnnual={isAnnual}
            />
            <p className="text-muted-foreground">
              Selected: {isAnnual ? "Annual (Save 20%)" : "Monthly"}
            </p>
          </div>
          <div className="mt-6">
            <CodeBlock
              code={`import { PricingToggle } from "@/components/PricingToggle";

<PricingToggle
  onChange={(isAnnual) => console.log(isAnnual)}
  defaultAnnual={false}
/>`}
            />
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Feature Comparison</h2>
        <p className="text-muted-foreground mb-6">
          Compare features across different plans
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <FeatureComparison features={comparisonFeatures} />
          <div className="mt-6">
            <CodeBlock
              code={`import { FeatureComparison } from "@/components/FeatureComparison";

const features = [
  { name: "API Access", free: true, pro: true, enterprise: true },
  { name: "Advanced Models", free: false, pro: true, enterprise: true },
];

<FeatureComparison features={features} />`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
